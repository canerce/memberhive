export class LoginController {

  constructor(Account, $state, GemAcl) {
    this.Account = Account;
    this.$state = $state;
    this.GemAcl = GemAcl;

    this.rememberMe = true;
    this.error = false;
  }

  login() {
    this.Account.login(
      {rememberMe: this.rememberMe},
      {username: this.username, password: this.password}
    )
    .$promise.then(
      (resp) => {
        this.error = false;
        this.Account.roles({'user_id': resp.user.id})
          .$promise.then((resp) => {
            this.GemAcl.setRights(resp.roles);
            this.$state.go('app.dashboard');
          });
      },
      (err) => {
        this.error = true;
        this.errorMsg = err.data.error.name;
        this.errorCode = err.data.error.code;
      }
    );
  }
}
