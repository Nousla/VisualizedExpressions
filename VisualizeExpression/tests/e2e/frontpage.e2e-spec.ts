import { browser, element, by } from 'protractor';

describe('Frontpage', function () {
  it('should go to the sandbox page', function () {
    browser.get("/");

    let sandboxBtn = element(by.css("#frontpage_sandboxbtn"));
    sandboxBtn.click();

    browser.getCurrentUrl().then((value: string) => {
      expect(value).toEqual(browser.baseUrl + "/sandbox");
    }, () => {
      fail();
    });

  });
});