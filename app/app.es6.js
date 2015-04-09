import 'jquery';
import 'angular';
import 'bootstrap';
import 'angular-animate';
import 'angular-cookies';
import 'angular-resource';
import 'angular-sanitize';
import 'angular-touch';
import 'angular-fontawesome';
import 'angular-ui-router';
import 'angular-bootstrap';
import 'bootstrap-select';
import 'angular-ui-select';
import 'angular-bootstrap-select';

import 'angular-gettext';
import 'angular-confirm';
import 'angular-moment';
import 'bootstrap-hover-dropdown';
import 'angular-toastr';
import 'angular-loading-bar';

// CSS
import 'bootstrap/css/bootstrap.css!';
import 'bootstrap/css/bootstrap-theme.css!';
import 'font-awesome/css/font-awesome.css!';
import 'github:silviomoreto/bootstrap-select/dist/css/bootstrap-select.css!';
import 'angular-loading-bar/build/loading-bar.css!';
import 'angular-ui-select/dist/select.min.css!';

// Own CSS
import 'styles/main.css!';

// Translations
import '_global/scripts/translations';

// Own modules
import '_global/scripts/lb-services';
import '_global/scripts/metronic/metronic';
import '_global/scripts/metronic/layout';

// Import services
import {Shout} from '_global/services/shout';
import {Search} from '_global/services/search';

import {controlGroupDirective} from '_global/directives/form-directives';
import {formatFiltersModule, dateFiltersModule} from '_global/scripts/filters';
import {gemConfigModule} from '_global/scripts/config';
import {gemDashboardModule} from 'dashboard/dashboard';
import {gemAddressModule} from 'address/address';
import {gemPersonModule} from 'person/person';
import {gemAuthModule} from 'auth/auth';
import {gemAclModule} from 'auth/acl';
import {gemNoteModule} from 'note/note';
import {gemOptionModule} from 'option/option';
import {gemReportModule} from 'report/report';

/**
 * The main Gemmii app module.
 */
export var gemMainModule = angular.module('gemmiiWebApp', [
  'ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 'ngTouch',
  'ui.router', 'ui.bootstrap',  'ui.select',
  'lbServices', 'formatFilters', 'picardy.fontawesome',
  'angular-bootstrap-select', 'angular-bootstrap-select.extra',
  'angular-confirm', 'angularMoment', 'angular-loading-bar',
  'gettext', 'textAngular', 'toastr',
  // GEM Module
  'gem.person', 'gem.dashboard', 'gem.option', 'gem.acl',
  'gem.auth', 'gem.note', 'gem.report', 'gem.config'
  ])
/**
 * Config
 */
  .config(
    ($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise('/dashboard');
  })
  .config(
    (cfpLoadingBarProvider) => {
      cfpLoadingBarProvider.includeBar = false;
      cfpLoadingBarProvider.spinnerTemplate = '<div class="blockui"><div class="page-spinner-bar"><div class="bounce1">' +
        '</div><div class="bounce2"></div><div class="bounce3"></div></div></div>';

    })
/**
 * Constants
 */
  .constant('config', {
    pagination: {
      pageSize: 25
    }
  })
/**
 * Controllers
 */
  .controller('AppController', ($scope, $rootScope, $cookies, gettextCatalog, PersonService) => {
    $scope.init = () => {
      Metronic.init();
    };
    $scope.$on('$viewContentLoaded', () => {
      Metronic.initComponents(); // init core components
    });

    $rootScope.currentUser = PersonService.currentUser();

    $rootScope.locales = {
      'en': {
        lang: 'en',
        country: 'US',
        name: gettextCatalog.getString('English')
      },
      'de': {
        lang: 'de',
        country: 'DE',
        name: gettextCatalog.getString('German')
      }
    };
    var lang = $cookies.lang || navigator.language || navigator.userLanguage;
    $rootScope.locale = $rootScope.locales[lang];
    if ($rootScope.locale === undefined) {
      $rootScope.locale = $rootScope.locales.de;
    }
    gettextCatalog.setCurrentLanguage($rootScope.locale.lang);

  })
  .controller('HeaderController', ($scope,$state,$filter,Search,LoopBackAuth) => {
    $scope.accessToken = LoopBackAuth.accessTokenId;
    $scope.getSearch = function(val) {
      var arr = Search.byComponent($scope.component,val);
      return $filter('filter')(arr,val);
    };
  })
  .controller('SidebarController', ($rootScope,$scope, Account, $state, GemAcl) => { /* Setup Layout Part - Sidebar */
    $scope.logout = () => {
      Account.logout().$promise.then((resp) => {
        GemAcl.setRights([]);
        $state.go('login');
      });
    };

    $scope.$on('$includeContentLoaded', () => {
      Layout.initSidebar(); // init sidebar

    });
  })
  .controller('PageHeadController', $scope => {/* Setup Layout Part - Sidebar */
    $scope.$on('$includeContentLoaded', () => {
    });
  })
  .controller('FooterController', $scope => {/* Setup Layout Part - Footer */
    $scope.$on('$includeContentLoaded', () => {
      Layout.initFooter(); // init footer
    });
  })
/**
 * Run
 */
  .run(($rootScope, settings, $state, GemAcl, Account, LoopBackAuth) => {
    $rootScope.$state = $state; // state to be accessed from view
    var p = Account.roles({'user_id': LoopBackAuth.currentUserId}).$promise;
    GemAcl.setRightsPromise(p);
  });
/**
 * Directives
 */
gemMainModule.directive('controlGroup', controlGroupDirective);
/**
 * Services
 */
gemMainModule.factory('Shout', Shout);
gemMainModule.service('Search', Search);

gemMainModule.factory('settings', $rootScope => {
  var settings = {
    layout: {
      pageSidebarClosed: false, // sidebar state
      pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    }
  };
  $rootScope.settings = settings;
  return settings;
});
