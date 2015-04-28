export class AppController {
  constructor($scope, $rootScope, $cookies, gettextCatalog, PersonService, $state, productName) {
    this.$rootScope = $rootScope;
    this.$cookies = $cookies;
    this.gettextCatalog = gettextCatalog;
    this.$state = $state;
    this.productName = productName;

    $scope.init = () => {
      Metronic.init();
    };
    $scope.$on('$viewContentLoaded', () => {
      Metronic.initComponents(); // init core components
    });

    $rootScope.currentUser = PersonService.currentUser();
  }

  /**
   * Get the title of the current page
   *
   * @todo Translate the page title (Can't be done in the config phase when the pageTitles are created)
   *
   * @returns {string} The formatted title
   */
  getTitle() {
    if (this.$state.current.hasOwnProperty('data'))
      return `${this.$state.current.data.pageTitle} | ${this.productName}`;
    return this.productName;
  }
}
