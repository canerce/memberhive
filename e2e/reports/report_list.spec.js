'use strict';

describe('list reports', function () {
  var page;

  beforeEach(function () {
    browser.get('http://localhost:9000/#/report/list');
    browser.sleep(500)
  });

 
  it('fab button should redirect to report/create', function () {
    browser.findElement(by.css('.md-fab')).click();
    browser.sleep(1000)

    expect(browser.getCurrentUrl()).toContain("report/create");
  });

});
