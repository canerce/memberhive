function LoginController(Account, $state, GemAcl) {
  function login() {
    Account.login(
      {rememberMe: this.rememberMe},
      {username: this.username, password: this.password},
      (err,user) => {
        this.error = false;
      },
      (err) => {
        this.error = true;
        this.errorMsg = err.data.error.name;
        this.errorCode = err.data.error.code;
      }
    )
    .$promise.then((resp) => {
        Account.roles({'user_id': resp.user.id})
          .$promise.then((resp) => {
            GemAcl.setRights(resp.roles);
            $state.go('dashboard');
          });
      }
    );

  }
  
  
  this.rememberMe = true;
  this.username = '';
  this.password = '';
  this.login = login;
  
  this.error = false;
  this.errorMsg = '';
  this.errorCode = '';
}

angular.module('gem.auth', []).controller('LoginController', LoginController);
