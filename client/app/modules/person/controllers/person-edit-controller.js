export class PersonEditController {
  constructor(PersonService, Person, Household, AddressService, $stateParams, $scope, Shout, gettextCatalog,
              $filter, $state, $q) {
    this.PersonService = PersonService;
    this.Person = Person;
    this.Household = Household;
    this.Shout = Shout;
    this.$scope = $scope;
    this.gettextCatalog = gettextCatalog;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.$state = $state;
    this.$q = $q;

    this.person = this.getPerson();

    this.relationTypes = PersonService.relationTypes;
    this.genders = PersonService.genders;
    this.households = PersonService.getHouseholds();
    this.addressTypes = AddressService.addressTypes;

    this.primaryContactTypes = ['Email', 'Mobile', 'Postal'];
    this.status = [];

    this.avatar = null;
    this.uploadedAvatar = null;
    this.croppedAvatar = null;
    this.avatarChanged = false;
    this.avatarDeleted = false;
    this.isEditingAvatar = false;

    this.datepickerBirthdateOpened = false;
    this.datepickerBaptismDateOpened = false;
  }

  loadTags(query) {
    return this.Person.tags({"text":query}).$promise;
  }

  loadStatus($query) {
    var status = this.PersonService.statusTypes;
    return status.filter((stat) => {
        return $query ? stat.text.toLowerCase().indexOf($query.toLowerCase()) !== -1
          : true;
    });
  }

  isEditing() {
    return this.$stateParams.id !== undefined;
  }

  getPerson() {
    return this.isEditing() ? this.PersonService.one(this.$stateParams.id) : new this.Person();
  }

  getTitle() {
    if (this.isEditing()) {
      return this.$filter('formatName')(this.person);
    } else {
      return this.gettextCatalog.getString('Create new Person');
    }
  }

  openBirthdateDatepicker(event) {
    event.preventDefault();
    event.stopPropagation();

    this.datepickerBaptismDateOpened = false;
    this.datepickerBirthdateOpened = true;
  }

  openBaptismDateDatepicker(event) {
    event.preventDefault();
    event.stopPropagation();

    this.datepickerBirthdateOpened = false;
    this.datepickerBaptismDateOpened = true;
  }

  editAvatar() {
    this.isEditingAvatar = true;
  }

  removeAvatar() {
    this.person.hasAvatar = false;
    this.avatarDeleted = true;
  }

  cancelEditingAvatar() {
    this.isEditingAvatar = false;
  }

  addHousehold(householdName) {
    this.Household.create({name: householdName}).$promise.then((household) => {
      this.person.household = household;
      this.households = this.PersonService.getHouseholds();
    });
  }

  /**
   * The user selected a new avatar
   *
   * @param files Selected files (should be only one)
   */
  onAvatarSelected(files, event) {
    var reader = new FileReader();
    var image = new Image();

    if (files[0]) {
      reader.readAsDataURL(files[0]);
      reader.onload = (event) => {
        this.$scope.$apply(() => {
          image.addEventListener('load', () => {
            if (!this.checkImage(image)) {
              this.Shout.info(this.gettextCatalog.getString(
                'For best results the image should be at least 800x800 pixels.'));
            }
            this.avatarChanged = true;
            this.uploadedAvatar = event.target.result;

          });
          image.src = event.target.result;

        });
      };
      reader.onerror = (err) => {
        this.Shout.error(this.gettextCatalog.getString('Can’t read image. Please try again.'));
      };
    }
  }

  /**
   * Checks whether the selected image fulfills the requirements
   *
   * @param image Image object
   * @returns {boolean} True, when
   */
  checkImage(image) {
    return (image.height >= 800 && image.width >= 800);
  }

  /**
   * Save all person data
   *
   * @todo When creating a new person, we should redirect to the person/view screen afterwards
   */
  save(isValid) {
    if (!isValid)
      return;

    var promises = [];
    this.person.hasAvatar = this.person.hasAvatar || this.avatarChanged;

    // Make sure the household is saved (`person.householdId` doesn't get updated)
    this.person.householdId = this.person.household ? this.person.household.id : '';

    // Use upsert() instead of $save() since $save will drop related data.
    // See https://github.com/strongloop/loopback-sdk-angular/issues/120
    promises.push(this.Person.upsert({}, this.person));
    if (this.avatarDeleted && !this.avatarChanged) {
      promises.push(this.PersonService.deleteAvatar(this.person));
    } else if (this.avatarChanged) {
      promises.push(this.PersonService.saveAvatar(this.person, PersonEditController.dataURItoBlob(this.croppedAvatar)));
    }
    var all = this.$q.all(promises);
    all.then(() => {
      this.Shout.success(this.gettextCatalog.getString(
        'Successfully saved "{{fullname}}"', {fullname: this.$filter('formatName')(this.person)}));
    });
    return all;
  }

  saveAndClose() {
    this.save().then(() => {
      this.$state.go('person.list');
    });
  }

  saveAndNew() {
    this.save().then(() => {
      this.$state.go('person.create');
    });
  }

  /**
   * Converts data uri to Blob. Necessary for uploading.
   * @see http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
   * @param  {String} dataURI
   * @return {Blob}
   */
  static dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: mimeString});
  }

}
