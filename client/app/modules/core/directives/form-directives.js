/**
 * Provides a shorthand for creating control-groups for bootstrap forms.
 *
 * Usage:
 *   <control-group label="Example">
 *     <input type="text" id="example" name="example" ng-model="data.example" required />
 *   </control-group>
 *
 * From http://aboutcode.net/2013/07/13/twitter-bootstrap-control-group-directive-for-angularjs.html
 */

export function controlGroupDirective() {
  return {
    template:
      /*jshint multistr: true */
      '<div class="form-group" ng-class="{ error: isError }">\
          <label class="control-label" for="{{for}}">{{label}}</label>\
          <div class="controls" ng-transclude></div>\
      </div>',

    replace: true,
    transclude: true,
    require: '^form',

    scope: {
      label: '@' // Gets the string contents of the `label` attribute
    },

    link: function(scope, element, attrs, formController) {
      // The <label> should have a `for` attribute that links it to the input.
      // Get the `id` attribute from the input element
      // and add it to the scope so our template can access it.
      var id = element.find(':input').attr('id');
      scope.for = id;

      // Get the `name` attribute of the input
      var inputName = element.find(':input').attr('name');

      if(inputName) {
        var errorExpression = [formController.$name, inputName, "$invalid"].join(".");
        scope.$parent.$watch(errorExpression, function(isError) {
          scope.isError = isError;
        });
      }
    }

  };
}

export function mhDateInput($filter) {
  return {
    template: '<datepicker date-format="shortDate"><input ng-model="date" type="text"/></datepicker>',
    restrict: 'E',
    scope: {
      ngModel: '=',
    },
    controller: function($scope) {
      $scope.date = $filter('date')(Date.parse($scope.ngModel), 'shortDate');
      $scope.$watch('date', function() {
        $scope.ngModel = $filter('date')(Date.parse($scope.date), 'medium');
      });
    }
  };
}
