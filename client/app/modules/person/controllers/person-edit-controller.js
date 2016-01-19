export function PersonEditController (
  gettextCatalog,
  AvatarService,
  PersonEditService,
  PersonService,
  Household,
  Person,
  resolvePerson,
  Shout,
  Group,
  $state,
  $http,
  $scope,
  $q,
  $mdDialog,
  $window
)
{    "ngInject";
  this.loadPerson = (data) => {
    var ret = PersonEditService.transform(data);
    $state.current.data.pageSubTitle = data.firstName + " " + data.lastName;
    this.person = ret;
    return ret;
  };

  this.loadPerson(resolvePerson);
  this.showExtended = false;
  this.personService = PersonService;
  this.uploadedAvatar = null;
  this.croppedAvatar = null; //populated

  this.saveWithNotification = () => {
    this.save().then(
      (person) => Shout.message(gettextCatalog.getString('Successfully saved "{{fullname}}"', {fullname: person.fullName})),
      (err) => Shout.vError(err)
    );
  };

  this.saveAndClose = () => {
    this.save().then(
      () => $state.go('person.list'),
      (err) => Shout.vError(err)
    );
  };

  this.saveAndNew = () => {
    this.save().then(
      () => $state.go('person.create'),
      (err) => Shout.vError(err)
    );
  };

  this.save = () => {
    return this.geoCodeAddress()
      .then(() => {
        return PersonEditService.save(PersonEditService.transformBack(this.person));
      })
      .then((data) => {
        if (this.avatarDeleted && !this.avatarChanged) {
          PersonService.deleteAvatar(data);
        } else if (this.avatarChanged && this.uploadedAvatar) {
          AvatarService.saveAvatarFromDataURI(data, this.uploadedAvatar);
        }
        return data;
      })
      .then((data) => {
        var promises = [];
        this.person.household.forEach((household) => {
          if(household.id) {//already a existing household
            if(!_.contains(this.person.householdIds, household.id)) { //not already linked to this person
              promises.push(Person.household.link({id: data.id, fk: household.id}).$promise);
            }
          } else {
            promises.push(Household.create({}, household).$promise.then((h) => {//create household
              return Person.household.link({id: data.id, fk: h.id}).$promise; //link to person
            }));
          }
        });
        return $q.all(promises).then(() => {return data;});
      })
      .then((data) => {
        var promises = [];
        this.person.groups.forEach((group) => {
          if(group.id) {//already a existing group
            if(!_.contains(this.person.groupIds, group.id)) { //not already linked to this person
              promises.push(Person.groups.link({id: data.id, fk: group.id}).$promise);
            }
          } else {
            promises.push(Group.create({}, group).$promise.then((g) => {//create group
              return Person.groups.link({id: data.id, fk: g.id}).$promise; //link to person
            }));
          }
        });
        return $q.all(promises).then(() => {return data;});
      })
      .then((data) => { return PersonEditService.getPerson(data.id);})
      .then(this.loadPerson);
  };

  this.addItem = (val) => {
    this.person[val].push({key: "", value : ""});
  };


  this.geoCodeAddress = () => {
    var geocalls = [];
    _.mapValues(this.person.address, (value)=> {
      var adr = "";
      if(value.street1)
        adr += value.street1;
      if(value.zipcode)
        adr += ", " + value.zipcode;
      if(value.city)
        adr += " " + value.city;

      if(!value.geocode) {
        geocalls.push($http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+adr).then((gdata)=>{
          if(gdata.data.results.length > 0)
            value.geocode = gdata.data.results[0].geometry.location;
        }));
      }
      return value;
    });

    return $q.all(geocalls);
  };

  this.onAvatarSelected = (files, event) => {
    var reader = new FileReader();
    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
      reader.onload = (event) => {
        this.uploadedAvatar = event.target.result;
        angular.element("#avatar_preview").src = event.target.result;
      };
      reader.onerror = (err) => {
        Shout.error(gettextCatalog.getString('Can’t read image. Please try again.'));
        this.uploadedAvatar = undefined;
      };
    }
  };

  this.createAccount = (ev) => {
    var username = this.person.firstName.toLowerCase() + "_" + this.person.lastName.toLowerCase();
    var password = Math.random().toString(36).slice(-8);
    var confirm = $mdDialog.confirm()
          .title('Create new account')
          .textContent('It will a create a user with the username: ' + username + '  and password: ' + password )
          .targetEvent(ev)
          .ok('Create Account!')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(() => {
      PersonEditService.createAccount(this.person, username, password)
        .then(
          data => Shout.success("Account Created"),
          err => Shout.vError(err)
        );
    });

  };

  this.goPreviousPerson = () => {
    PersonService.getCachedAll().then((persons) => {
      var index = _.findIndex(persons, p => p.id === this.person.id);
      index--;
      if(persons[index]) {
        $state.go('person.edit', {id: persons[index].id});
      }
    });
  };

  this.goNextPerson = () => {
     PersonService.getCachedAll().then((persons) => {
      var index = _.findIndex(persons, p => p.id === this.person.id);
      index++;
      if(persons[index]) {
        $state.go('person.edit', {id: persons[index].id});
      }
    });
  };
}
