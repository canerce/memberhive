angular.module('gem.report').config(
  ($stateProvider, $compileProvider) => {
    $stateProvider.state('report', {
      url: '/report',
      template: '<ui-view/>',
      abstract: true,
      data: {
        module: 'report',
        pageTitle: 'Report'
      }
    }).state('report.create', {
      url: '/create',
      templateUrl: '../report/views/report.create.html',
      data: {
        pageSubTitle: 'Create and edit reports'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('report.list', {
      url: '/list',
      templateUrl: '../report/views/report.list.html',
      data: {
        pageSubTitle: 'List available reports'
      },
      acl: {
        needRights: ['$authenticated']
      }
    });
  }
);
