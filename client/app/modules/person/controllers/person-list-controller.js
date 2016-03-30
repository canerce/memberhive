export function PersonListController(
  PersonService,
  PersonEditService,
  resolvePersons,
  $scope,
  $state,
  q,
  AccountOptions
)  {"ngInject";
  this.allPersons = resolvePersons;
  this.query = {};
  this.queryModel = [];
  this.persons = [];
  this.editPerson = (person) => {
    $state.go('person.edit', {id: person.id});
  };

  this.loadMorePersons = (count) => {
    count = count || 10;
    if(this.persons.length === this.allPersons.length) {//there are no more persons
      return;
    }

    for(let i = 0; i < count; i++) {//add count persons to the this.persons list from this.allPersons
      this.persons.push(this.allPersons[this.persons.length]);
      if(this.persons.length === this.allPersons.length) {
        return;
      }
    }
  };
  this.loadMorePersons(15);

  this.deletePerson = (person) => {
    PersonEditService.delete(person)
      .then(this.reload);
  };

  this.reload = (query) => {
    q.all(query)
      .then((resolved) => PersonService.getAllFilterd(resolved))
      .then((d) => {
        //AccountOptions.set('person_list_query', this.queryModel);
        this.allPersons = d;
        this.persons = [];
        this.loadMorePersons(15);
       });
  };

  //TODO: fix too many reloads
  $scope.$watch(
    () => {
      return this.query;
    },
    (newValue) => {this.reload(newValue);}, true);
}
