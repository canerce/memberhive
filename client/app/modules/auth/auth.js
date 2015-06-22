import {LoginController} from './controller/auth-controller';
import {MenuSection, MenuLink} from '../core/providers/menu-provider';

export var gemAuthModule = angular.module('gem.auth', []).config(
  ($stateProvider, gettext) => {
      $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'modules/auth/views/login.html',
        data: {
          pageTitle: gettext('Login')
        }
      });
    }
);

gemAuthModule.controller('LoginController', LoginController);
