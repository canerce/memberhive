export function HeaderController($scope, $state, Search) {
  this.searchText = '';


  this.querySearch = (value) => {
    return Search.byComponent(this.getComponent(), value).$promise.then((data) => {
      return data.results;
    });
  };

  this.getComponent = () => {
    if ($state.current.hasOwnProperty('data'))
      return $state.current.data.component;
    return 'all';
  };

  $scope.component = this.getComponent();

  $scope.$on('$stateChangeSuccess', () => {
    $scope.component = this.getComponent();
  });


  this.searchTextChanged = (text) => {
    console.log('Text changed to ' + text);
  };
  this.selectedItemChange = (item) =>  {
    $state.go('person.view', {id: item.id});
    console.log('Item changed to ' + JSON.stringify(item));
  };

}
