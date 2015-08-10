export function PersonImportImagesController(Person, $scope, AvatarService, Shout) {"ngInject";
  Person.find().$promise.then((data) => this.persons = data);
  this.importStarted = false;
  this.progress = 0;
  this.filesCount = 0;
  this.uploadImportFiles = (files) => {
    if(!files) return;
    
    this.importStarted = true;
    this.filesCount = files.length;
    this.counter = 0;
    for(var file of files) {
      var name = file.name.substr(0, file.name.lastIndexOf('.')).split('_');
      var firstName = name[1];
      var lastName = name[0];
      
      for(var person of this.persons) {
        if(person.firstName === firstName && person.lastName === person.lastName) {
          console.log("save avatar of " + file.name + "to " + person.firstName);
          AvatarService.saveAvatar(person.id, file).then(() => {
            this.counter++;
            this.updateProgress();
          });
          break;
        }
      }
    }
    //foreach
  };
  
  this.updateProgress = () => {
    console.log(this.counter, this.filesCount);
    if(this.filesCount === 0 || this.counter === 0) {
      this.progress = 0;
      return;
    }
    this.progress = (this.counter / this.filesCount)*100;
  };
  
  $scope.$watch('files', () => {
    this.uploadImportFiles($scope.files);
  });
  
  
}
