import 'codemirror';

import 'textAngular';
import 'textAngular/dist/textAngular-rangy.min';
import 'textAngular/dist/textAngular-sanitize.min';
import 'textAngular/src/textAngular.css!';

import 'jQuery-QueryBuilder';
import 'bootstrap-datepicker/js/bootstrap-datepicker';

import {ReportController} from 'report/controllers/report-controller';
import {ReportUpsertController} from 'report/controllers/report-upsert-controller';

import {QueryBuilderDirective} from 'report/directives/querybuilder-directive';
import {ReportService} from 'report/services/report-service';

export var gemReportModule = angular.module('gem.report', []).config(
  ($stateProvider,$provide) => {
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
      templateUrl: '../report/views/report.upsert.html',
      data: {
        pageSubTitle: 'Create a new report'
      },
      acl: {
        needRights: ['$authenticated']
      }
    }).state('report.edit', {
        url: '/edit/:id',
        templateUrl: '../report/views/report.upsert.html',
        data: {
          pageSubTitle: 'Edit a report'
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

    //textAngular setup
    $provide.decorator('taOptions',['$delegate', function(taOptions) {
      taOptions.toolbar = [
        ['html','h1','h2','h3'],
        ['bold','italics']
      ];
      return taOptions;
    }]);
  }
);

gemReportModule.controller('ReportController', ReportController);
gemReportModule.controller('ReportUpsertController', ReportUpsertController);

gemReportModule.directive('gemQuerybuilder', QueryBuilderDirective);
gemReportModule.factory('ReportService', ReportService);
