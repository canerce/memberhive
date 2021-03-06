'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var sauceConnectLauncher = require('sauce-connect-launcher');
module.exports = function(options) {
  // Downloads the selenium webdriver
  gulp.task('webdriver-update', $.protractor.webdriver_update);

  gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);
  function runProtractor (done) {

    gulp.src(options.e2e + '/**/*.js')
      .pipe($.protractor.protractor({
        configFile: process.env.TRAVIS ? 'protractor.travis.conf.js' : 'protractor.conf.js' 
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      })
      .on('end', function () {
        // Close browser sync server
        browserSync.exit();
        done();
      });
  }

  gulp.task('protractor', ['protractor:src']);
  gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
  gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
  
  // connects to saucelabs server and runs protractor e2e tests against saucelabs server
  gulp.task('protractor:src:sauce', ['serve:e2e'], function() {
    sauceConnectLauncher({
      username: process.env.SAUCE_USERNAME,
      accessKey:  process.env.SAUCE_ACCESS_KEY,
      // logger: console.log
    }, function (err, sauceConnectProcess) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log("Sauce Connect ready");

       gulp.src(options.e2e + '/**/*.js')
        .pipe($.protractor.protractor({
          configFile: 'protractor.travis.conf.js'
        }))
        .on('error', function(e) {
          sauceConnectProcess.close(function () {
            process.exit(-1);
            console.log("Closed Sauce Connect process");
          });
          throw e;
        })
        .on('end', function(e) {
          sauceConnectProcess.close(function () {
            process.exit();
            console.log("Closed Sauce Connect process");
          });
        });

    });
  });
};
