import {MainMenu} from 'modules/core/providers/menu-provider';

export class SidebarController {
  constructor($scope, Account, $state, GemAcl, MainMenu) {
    $scope.$on('$includeContentLoaded', () => {
      Layout.initSidebar(); // init sidebar
    });

    $scope.logout = () => {
      Account.logout().$promise.then((resp) => {
        GemAcl.setRights([]);
        $state.go('app.login');
      });
    };

    $scope.mainMenu = MainMenu.getItems();
  }
}
