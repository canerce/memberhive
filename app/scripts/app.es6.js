/**
 * The main Gemmii app module.
 */
angular.module('gemmiiWebApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'picardy.fontawesome',
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'oc.lazyLoad',
  'lbServices',
  'gettext',

  'formatFilters',
  
  'gem.person',
  'gem.dashboard',
  'gem.option',
  'gem.acl',
  'gem.auth'
  ])

  .config(
    ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) => {
      $urlRouterProvider.otherwise('/dashboard');
      $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      });
  })

  .factory('settings', $rootScope => {
    var settings = {
      layout: {
        pageSidebarClosed: false, // sidebar state
        pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
      }
    };
    $rootScope.settings = settings;
    return settings;
  })

  .controller('AppController', $scope => {
      $scope.init = () => {
        Metronic.init();
      };
      $scope.$on('$viewContentLoaded', () => {
        Metronic.initComponents(); // init core components
      });
    })
  .controller('HeaderController', $scope => {
    $scope.$on('$includeContentLoaded', () => {
      Layout.initHeader(); // init header
    });
  })
  .controller('SidebarController', ($scope, GemAcl) => { /* Setup Layout Part - Sidebar */
    
    $scope.$on('$includeContentLoaded', () => {
      Layout.initSidebar(); // init sidebar
      $scope.acl = GemAcl;
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

  .run(($rootScope, settings, $state) => {
    $rootScope.$state = $state; // state to be accessed from view
  }).run(['GemAcl', (GemAcl) => {
  }]);

angular.module(
  'gem.person',
  [
    'ui.router',
    'lbServices'
  ]
);

angular.module(
  'gem.dashboard',
  [
    'ui.router',
    'lbServices',
    'gem.acl'
  ]
);

angular.module(
  'gem.auth',
  [
    'ui.router',
    'lbServices'
  ]
);

angular.module(
  'gem.option',
  [
    'ui.router',
    'lbServices'
  ]
);
