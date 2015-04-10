import {MainMenu} from 'core/providers/menu-provider';
import {controlGroupDirective} from 'core/directives/form-directives';
import {Shout} from 'core/services/shout';
import {Search} from 'core/services/search';
import {CoreConfig} from 'core/config/config';


/**
 * This module holds dependencies needed by other modules including the `gemmiiWebApp` module.
 * Thus, it will be loaded before all other modules.
 *
 * @type {module}
 */
export var gemCoreModule = angular.module('gem.core', []);

gemCoreModule.run(function($rootScope) {
  $rootScope.gemConfig = {
    layout: {
      pageSidebarClosed: false, // sidebar state
      pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    },
    pagination: {
      pageSize: 25
    }
  };
});

// Providers
gemCoreModule.provider('MainMenu', MainMenu);

// Services
gemCoreModule.service('Search', Search);

// Factories
gemCoreModule.factory('Shout', Shout);
gemCoreModule.factory('config', CoreConfig);

// Directives
gemCoreModule.directive('controlGroup', controlGroupDirective);
