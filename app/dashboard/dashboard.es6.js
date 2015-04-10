/*
 Import
 '_global/scripts/metronic/plugins/morris/morris.min.js',
 '_global/scripts/metronic/plugins/morris/raphael-min.js',
 '_global/scripts/metronic/pages/tasks.js',
 'scripts/dashboard/controllers/dashboard-controller.js'
 */
import 'jquery-ui'; //why do i need to do this?
import 'angular-ui/ui-sortable';//why do i need to do this?
import 'angular-dashboard-framework';

import 'adf/structures';
import 'adf/widgets/weather/weather';

import {DashboardController} from 'dashboard/controllers/dashboard-controller';
import {MenuSection, MenuLink} from 'core/providers/menu-provider';

export var gemDashboardModule = angular.module('gem.dashboard',
  [
    'adf',
    'structures',
    'adf.widgets.weather'
  ])
  .config(
    ($stateProvider, MainMenuProvider, gettext) => {
      $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: '../dashboard/views/dashboard.html',
        data: {
          pageTitle: gettext('Dashboard')
        },
        acl: {
          needRights: ['$authenticated']
        }
      });

      MainMenuProvider.add(new MenuLink(gettext('Dashboard'), 'laptop', 'dashboard'));
    }
  );

gemDashboardModule.controller('DashboardController', DashboardController);
