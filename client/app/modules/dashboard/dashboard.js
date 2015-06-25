import {DashboardController} from './controllers/dashboard-controller';
import {MenuSection, MenuLink} from '../core/providers/menu-provider';

export var gemDashboardModule = angular.module('gem.dashboard',
  [
    'adf',
    'adf.structures.base',
    //'adf.widget.clock',
   // 'adf.widget.weather'
  ]);
gemDashboardModule.config(
  ($stateProvider, MainMenuProvider, gettext) => {
    $stateProvider
      .state('dashboard', {
      url: 'dashboard',
      templateUrl: 'app/modules/dashboard/views/dashboard.html',
      data: {
        pageTitle: gettext('Dashboard')
      },
      ncyBreadcrumb: {
        label: gettext('Home')
      },
      acl: {
        needRights: ['$authenticated']
      }
    });

    MainMenuProvider.add(new MenuLink(gettext('Dashboard'), 'computer', 'dashboard'));
  }
);

gemDashboardModule.value('adfTemplatePath', 'app/modules/dashboard/templates/');

gemDashboardModule.controller('DashboardController', DashboardController);
