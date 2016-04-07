'use strict';

describe('group.list', () => {
  var page;

  beforeEach(() => {
    browser.get('#/group/list');
  });

 
  it('it should have an fab button', () => {
    expect(element(by.css('.md-fab')).isPresent()).toBe(true);
  });
  
  it('fab button should redirect to person/create', () => {
    browser.findElement(by.css('.md-fab')).click();
    expect(browser.getCurrentUrl()).toContain("group/create");
  });

});

