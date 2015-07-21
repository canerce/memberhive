/**
 * Directive to show and edit a note
 *
 * Minimal Usage:
 *   <gem:note-editform />
 */
export function NoteEditFormDirective() {
  return {
    scope: {
        note: '='
    },
    restrict: 'E',
    templateUrl: 'app/modules/note/templates/note-edit-form-directive.html'
  };
}

export function NoteTreeDirective() {
  return {
    scope: {
        tree: '='
    },
    restrict: 'E',
    templateUrl: 'app/modules/note/templates/note-tree-directive.html'
  };
}

export function NoteCreateDirective() {
  return {
    scope: {
        notableId: '@',
        notableType: '@',
        newNote: '&'
    },
    controller: function ($scope, $element, $mdDialog, Note, Shout, gettextCatalog) {
      this.type = 'note';
      this.noteTypes = [{
        icon: 'chat',
        title: 'Note',
        value: 'note'
      },{
        icon: 'email',
        title: 'Email',
        value: 'email'
      },{
        icon: 'call',
        title: 'Phone',
        value: 'phone'
      },{
        icon: 'group',
        title: 'Meeting',
        value: 'meeting'
      },{
          icon: 'backup',
          title: 'Prayer',
          value: 'prayer'
        },
      ];

      this.create = () => {
        console.log('create');
        Note.upsert(
          {
            title: this.title,
            content: this.content,
            type: this.type,
            notableId: $scope.notableId,
            notableType: $scope.notableType
          }).$promise
        .then(
          (data) => {
            Shout.message(gettextCatalog.getString('Note created'));
            $scope.newNote({note:data});
          }
        );
        this.clear();
      };

      this.clear = () => {
        this.title = '';
        this.content = '';
        this.noteType = '';
      };

      this.createDialog = ($event) => {
        $mdDialog.show({
          controller: this.DialogController,
          controllerAs: 'ctrl',
          bindToController: true,
          templateUrl: 'createNote.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          locals: {
            noteTypes: this.noteTypes,
            type: this.type,
            title: this.title,
            content: this.content
          },
        })
          .then(function(answer) {
            console.log('You said the information was good: '+answer);
          }, function() {
            console.log('You said the information was nada');
          });
      };

      this.DialogController = ($scope, $mdDialog, content) => {
        $scope.hide = function() {
          console.log('hide');
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.create = function(content) {
          console.log('OK: '+content);
          $mdDialog.hide();
        };
      };

      this.close = ($element) => {
        //console.log($scope);
      };
    },
    controllerAs: 'ctrl',
    restrict: 'E',
    templateUrl: 'app/modules/note/templates/note-create-directive.html'
  };
}


