export function PersonService(Person, Household, Avatar, LoopBackAuth, gettextCatalog,
                              $upload, apiUrl, $rootScope) {
  return {
    modelName: () => {
      return Person.model.name;
    },

    currentUser: () => {
      return Person.findById({id: LoopBackAuth.currentUserId});
    },

    one: (id) => {
      return Person.findById({
        id: id,
        filter: {
          include: [
            'account',
            {
              'household': [
                {'persons': 'relationType'},
                'address'
              ]
            },
            'ministries',
            'relationType',
          ]
        }
      });
    },

    all: (pageNumber) => {
      return Person.find({
        filter: {
          limit: $rootScope.gemConfig.pagination.pageSize,
          offset: (pageNumber - 1) * $rootScope.gemConfig.pagination.pageSize,
          order: ['lastName ASC', 'firstName ASC', 'middleName ASC'],
          include: [
            'account',
            {
              'household': {'persons': 'relationType'}
            },
            'ministries',
            'relationType',
          ]
        }
      });
    },
    saveAvatar: (person, file) => {
      $upload.upload({
        url: `${apiUrl}/Avatars/${person.id}/upload`,
        file: file,
        fileName: 'avatar.jpg'
      });
    },

    deleteAvatar: (person) => {
      Avatar.destroyContainer({container: person.id});
    },

    delete: (personId, cb) => {
      Person.trash({id: personId}).$promise.then(cb);
    },

    /**
     * Return a list of available Households
     */
    getHouseholds: () => {
      return Household.find();
    },


    /**
     * A dictionary with gender translations
     */
    genders: {
      'm': gettextCatalog.getString('Male'),
      'f': gettextCatalog.getString('Female')
    },

    /**
     * A dictionary with translations of standard status items.
     */
    statusTypes: {
      'member': {'selected': false, 'text': gettextCatalog.getString('Member')},
      'member_prospect':  {'selected': false, 'text': gettextCatalog.getString('Member Prospect')},
      'member_former': {'selected': false, 'text': gettextCatalog.getString('Former Member')},
      'member_passed': {'selected': false, 'text': gettextCatalog.getString('Passed Member')},
      'member_restore': {'selected': false, 'text': gettextCatalog.getString('Church Discipline')},
      'visitor': {'selected': false, 'text': gettextCatalog.getString('Visitor')},
      'visitor_regular': {'selected': false, 'text': gettextCatalog.getString('Regular Visitor')},
      'visitor_irregular': {'selected': false, 'text': gettextCatalog.getString('Irregular Visitor')},
      'visitor_first': {'selected': false, 'text': gettextCatalog.getString('First-Time Visitor')},
      'missionary': {'selected': false, 'text': gettextCatalog.getString('Missionary')}
    },
    /**
     * A dictionary with translations of the relationTypes table.
     */
    relationTypes: {
      'husband': gettextCatalog.getString('Husband'),
      'wife': gettextCatalog.getString('Wife'),
      'son': gettextCatalog.getString('Son'),
      'daughter': gettextCatalog.getString('Daughter'),
      'cousin': gettextCatalog.getString('Cousin'),
      'uncle': gettextCatalog.getString('Uncle'),
      'aunt': gettextCatalog.getString('Aunt'),
      'brother': gettextCatalog.getString('Brother'),
      'sister': gettextCatalog.getString('Sister'),
      'grandfather': gettextCatalog.getString('Grandfather'),
      'grandmother': gettextCatalog.getString('Grandmother'),
      'grandson': gettextCatalog.getString('Grandson'),
      'granddaughter': gettextCatalog.getString('Granddaughter'),
      'mother': gettextCatalog.getString('Mother'),
      'father': gettextCatalog.getString('Father'),
      'nephew': gettextCatalog.getString('Nephew'),
      'niece': gettextCatalog.getString('Niece'),
      'motherInLaw': gettextCatalog.getString('Mother in Law'),
      'fatherInLaw': gettextCatalog.getString('Father in Law'),
      'brotherInLaw': gettextCatalog.getString('Brother in Law'),
      'sisterInLaw': gettextCatalog.getString('Sister in Law'),
      'sonInLaw': gettextCatalog.getString('Son in Law'),
      'daughterInLaw': gettextCatalog.getString('Daughter in Law'),
      'stepbrother': gettextCatalog.getString('Stepbrother'),
      'stepsister': gettextCatalog.getString('Stepsister')
    }

  };
}
