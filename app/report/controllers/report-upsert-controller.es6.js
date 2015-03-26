'use strict';

export function ReportUpsertController($scope,Report,ReportService,Person,LoopBackAuth,gettext,Shout,$stateParams) {
  var _self = this;
  this.curUser = LoopBackAuth.currentUserId;
  this.data = '';

  this.report = {
   name: 'My default report',
   slur: 'person/simple',
   query: {}, // the "where" part, specific to underlying DAL (like loopback)
   rule: _self.data, // jQuery Plugin specific (so we can reload a created query)
   active: true,
   widgetize: false,
   reportHtml: '',
   createdAt: new Date(),
   createdBy: _self.curUser
   };

  $scope.reportHtml = '<table class="table table-striped table-hover"><thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Email</th></tr> </thead> <tbody> <tr><td>1</td><td>Mark</td><td>Otto</td><td>makr124@gmx.net</td></tr> </tbody> </table>';

  $scope.textAreaSetup = function($element) {
    $element.attr('ui-codemirror', '');
  };

  /** Functions **/
  this.getReport = () => {
    _self.report = ReportService.one($stateParams.id);
  };
  this.setBuilderRules = () => {
    //console.log( _self.report.rule);
    return _self.report.rule;
  };
  this.saveQuery = queryObj => {
    if (queryObj) {
      _self.report.query = queryObj.query;
      _self.report.rule = queryObj.rule;
      _self.report.name = $scope.name;
      ReportService.save(_self.report);
      _self.setBuilderRules();
    }
  };
  this.setBuilderFilters = () => {
    return _self.personModel;
  };
  this.setBuilder = () => {

  };

  /** Dictionaries **/
  this.personModel = [
    {id: 'firstName',label: gettext('Firstname'),type: 'string',optgroup: gettext('Person')},
    {id: 'lastName',label: gettext('Lastname'),type: 'string',optgroup: gettext('Person')},
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

  this.getReport();
  this.setBuilderRules();
}
