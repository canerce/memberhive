'use strict';

describe('test the dashboard', function () {
  var page;

  beforeEach(function () {
    browser.get('http://localhost:9000/#/dashboard');
    browser.sleep(500)
  });

 
  xit('it should have a edit button', function () {
    var list = element.all(by.css('[ng-click="toggleEditMode()"]'));
    expect(list.count()).toBe(1);
  });

});
