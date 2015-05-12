import 'ng-file-upload';
import 'ngImgCrop/compile/unminified/ng-img-crop';
import 'ngImgCrop/compile/unminified/ng-img-crop.css!';
import 'angularUtils-pagination';
import 'nsPopover';
import 'ngTagsInput';
import 'ngTagsInput/build/ng-tags-input.css!';
import 'ngTagsInput/build/ng-tags-input.bootstrap.css!';

import './filters/person-filters';

import {PersonListController} from './controllers/person-list-controller';
import {PersonEditController} from './controllers/person-edit-controller';
import {PersonViewController} from './controllers/person-view-controller';
import {PersonImportController} from './controllers/person-import-controller';
import {PersonExportController} from './controllers/person-export-controller';
import {HouseholdListController} from './controllers/household-list-controller';
import {HouseholdEditController} from './controllers/household-edit-controller';
import {PersonService} from './services/person-service';
import {AvatarDirective} from './directives/person-directives';

import {MenuSection, MenuLink} from 'modules/core/providers/menu-provider';

import './styles/person.css!';

export var gemPersonModule = angular.module('gem.person',
  [
    'angularUtils.directives.dirPagination',
    'nsPopover',
    'ngFileUpload',
    'ngImgCrop',
    'ngTagsInput',

    'personFilters',

    'gem.core',
    'gem.address'
  ]
).config(
  ($stateProvider, $compileProvider, MainMenuProvider, gettext) => {
    $stateProvider.state('person', {
      url: '/person',
      template: '<ui-view/>',
      data: {
        pageTitle: gettext('Person'),
        component: 'person',
        sidebarFolded: true
      },
      abstract: true
    }).state('person.list', {
      url: '/list',
      templateUrl: 'modules/person/views/person.list.html',
      data: {
        pageTitle: gettext('Persons'),
        pageSubTitle: gettext('Create and edit Persons')
      },
      ncyBreadcrumb: {
        label: gettext('Persons')
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.view', {
      url: '/view/:id',
      templateUrl: 'modules/person/views/person.view.html',
      data: {
        pageSubTitle: gettext('View Person details')
      },
      ncyBreadcrumb: {
        label: gettext('View Person'),
        parent: 'person'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.create', {
      url: '/create',
      templateUrl: 'modules/person/views/person.edit.html',
      data: {
        pageSubTitle: gettext('Create a Person')
      },
      ncyBreadcrumb: {
        label: gettext('New Person'),
        parent: 'person'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.edit', {
      url: '/edit/:id',
      templateUrl: 'modules/person/views/person.edit.html',
      data: {
        pageSubTitle: gettext('Edit a Person')
      },
      ncyBreadcrumb: {
        label: gettext('Edit Person'),
        parent: 'person'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.import', {
      url: '/import',
      templateUrl: 'modules/person/views/person.import.html',
      data: {
        pageSubTitle: gettext('Import Persons')
      },
      ncyBreadcrumb: {
        label: gettext('Import'),
        parent: 'person'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.export', {
      url: '/export',
      templateUrl: 'modules/person/views/person.export.html',
      data: {
        pageSubTitle: gettext('Export Persons')
      },
      ncyBreadcrumb: {
        label: gettext('Export'),
        parent: 'person'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.households', {
      url: '/households',
      templateUrl: 'modules/person/views/household.list.html',
      data: {
        pageTitle: gettext('Households'),
        pageSubTitle: gettext('View Households')
      },
      ncyBreadcrumb: {
        label: gettext('Households')
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.household-edit', {
      url: '/household/edit/:id',
      templateUrl: 'modules/person/views/household.edit.html',
      data: {
        pageTitle: gettext('Households'),
        pageSubTitle: gettext('Edit Household')
      },
      ncyBreadcrumb: {
        label: gettext('Edit Household')
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('person.household-create', {
      url: '/household/create',
      templateUrl: 'modules/person/views/household.edit.html',
      data: {
        pageTitle: gettext('Households'),
        pageSubTitle: gettext('Create Household')
      },
      ncyBreadcrumb: {
        label: gettext('New Household')
      },
      acl: {
        needRights: ['$authenticated']
      }
    });

    // Allow skype urls http://stackoverflow.com/a/15769779
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|skype):/);

    MainMenuProvider.add(new MenuSection(gettext('Persons'), 'user',
      [
        new MenuLink(gettext('List Persons'), 'users', 'person.list'),
        new MenuLink(gettext('Create Person'), 'user-plus', 'person.create'),
        new MenuLink(gettext('List Households'), 'hotel', 'person.households'),
        new MenuLink(gettext('Create Household'), 'plus', 'person.household-create'),
        new MenuLink(gettext('Import'), 'upload', 'person.import'),
        new MenuLink(gettext('Export'), 'share', 'person.export')
      ]
    ));
  }
);
gemPersonModule.controller('PersonListController', PersonListController);
gemPersonModule.controller('PersonViewController', PersonViewController);
gemPersonModule.controller('PersonEditController', PersonEditController);
gemPersonModule.controller('PersonImportController', PersonImportController);
gemPersonModule.controller('PersonExportController', PersonExportController);
gemPersonModule.controller('HouseholdListController', HouseholdListController);
gemPersonModule.controller('HouseholdEditController', HouseholdEditController);

gemPersonModule.factory('PersonService', PersonService);

gemPersonModule.directive('gemAvatar', AvatarDirective);
