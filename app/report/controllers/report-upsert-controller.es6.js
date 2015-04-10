export class ReportUpsertController {

  constructor($scope,Report,ReportService,Person,LoopBackAuth,gettext,Shout,$stateParams) {
    this.$scope = $scope;
    this.Report = Report;
    this.ReportService = ReportService;
    this.Person = Person;
    this.LoopBackAuth = LoopBackAuth;
    this.gettext = gettext;
    this.Shout = Shout;
    this.$stateParams = $stateParams;

    this.report = this.getReport();
    this.curUser = LoopBackAuth.currentUserId;
    $scope.reportHtml = '';

    $scope.textAreaSetup = function($element) {
      $element.attr('ui-codemirror', '');
    };

    /** Dictionaries **/
    this.personModel = [
      {id: 'firstName',label: gettext('First Name'),type: 'string',optgroup: gettext('Person')},
      {id: 'lastName',label: gettext('Last Name'),type: 'string',optgroup: gettext('Person')},
      {
        id: 'gender',label: gettext('Gender'),type: 'string',optgroup: gettext('Person'),
        input:'radio',values:{'m':gettext('Male'),'f':gettext('Female')}
      },
      {
        id: 'birthdate',label: gettext('Birthdate'),type: 'date',optgroup: gettext('Person'),
        validation: {
          format: 'YYYY/MM/DD'
        },
        plugin: 'datepicker',
        plugin_config: { // jshint ignore:line
          format: 'yyyy/mm/dd',
          todayBtn: 'linked',
          todayHighlight: true,
          autoclose: true
        }
      }
    ];
  }

  getReport() {
      return this.$stateParams.id ? this.ReportService.one(this.$stateParams.id) : null;
  }

  saveReport() {
    this.report.name = this.$scope.reportUpCtrl.report.name;
    this.report.html = this.$scope.reportUpCtrl.report.html;
    this.ReportService.save(this.report);
  }

  setBuilderFilters() {
    return this.personModel;
  }
}
