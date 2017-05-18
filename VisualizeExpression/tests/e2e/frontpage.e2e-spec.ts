import { browser, element, by } from 'protractor';

describe('Frontpage', () => {
  it('should be on the frontpage', () => {
        browser.get("/");

        browser.getCurrentUrl().then((value: string) => {
            expect(value).toEqual(browser.baseUrl + "/");
        }, () => {
            fail();
        });
    });
  
  it('should go to the sandbox page', () => {
    browser.get("/");

    let sandboxBtn = element(by.css("#frontpage-sandboxbtn"));
    sandboxBtn.click();

    browser.getCurrentUrl().then((value: string) => {
      expect(value).toEqual(browser.baseUrl + "/sandbox");
    }, () => {
      fail();
    });
  });
});