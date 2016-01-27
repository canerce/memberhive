export function PersonEditService(
  $q,
  PersonService,
  Person
) {"ngInject";
  this.person = undefined;
  this.account = undefined;


  /*
   * Load Person by person_id.
   * Cached
   */
  this.getPerson = (personId) => {
    /*if(this.person && this.person.id === personId) //return cached person
      return $q.when(this.person);*/
    return PersonService.one(personId)
      .then((p) => this.person = p);//cache person
  };

  this.save = (person) => {
    return Person.upsert({filter: {include: ['household', 'groups']}}, PersonService.undoMap(person))
      .$promise.then((d) => {return PersonService.mapPerson(d);});
  };

  this.delete = (person) => {
    return Person.deleteById({id: person.id}).$promise;
  };

  this.createAccount = (person, username, password) => {
    return Person.account.create(
      {id: person.id},
      {
        username: username,
        email: person.emails.personal,
        password: password || person.lastName
      }
    ).$promise;
  };


  this.transform = (person) => {
    person.contactsList = this.fromHashToList(person.contacts);
    person.datesList = this.fromHashToList(person.dates);
    person.emailsList = this.fromHashToList(person.emails);
    person.customList = this.fromHashToList(person.custom);
    return person;
  };

  this.transformBack = (person) => {
    person.contacts = this.fromListToHash(person.contactsList);
    person.dates = this.fromListToHash(person.datesList);
    
    //remove all time information because it is a date
    person.dates = _.mapValues(person.dates, (d) => {
      if(d instanceof Date)
        d = d.toISOString();
      var split = d.split("T");
      return split[0]+"T00:00:00.000Z";
    });
    
    person.emails = this.fromListToHash(person.emailsList);
    person.custom = this.fromListToHash(person.customList);
    delete person.contactsList;
    delete person.addressesList;
    delete person.datesList;
    delete person.emailsList;
    delete person.customList;
    return person;
  };

  this.fromHashToList = (hash) => {
    var ret = [];
    _.forEach(hash, (value, key) => {
      ret.push({key: key, value: value});
    });
    return ret;
  };
  this.fromListToHash = (list) => {
    var ret = {};
    _.forEach(list, (value) => {
      ret[value.key] = value.value;
    });
    return ret;
  };

  this.assign = (item, values, ids, relation, singleton) => {
    var promises = [];
    var used = [];
    values.forEach((value) => {
      if(value.id) {//already a existing group
        if(!_.contains(ids, value.id)) { //not already linked to this person
          promises.push(relation.link({id: item.id, fk: value.id}).$promise);
        }
        used.push(value.id);
      } else {
        promises.push(singleton.create({}, value).$promise.then((newValue) => {//create group
          return relation.link({id: item.id, fk: newValue.id}).$promise; //link to person
        }));
      }
    });
    
    _.difference(ids, used).forEach((id) => {
      promises.push(relation.unlink({id: item.id, fk: id}).$promise);
    });
    
    return $q.all(promises).then(() => {return item;});
  };
}
