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

  it('should chose sandbox type and write an expression then generate a URL', function () {
    browser.get("/");

    element(by.css('#frontpage-dropdownmenu')).click();
    var items = element.all(by.css('.ui-dropdown-item'));
    items.get(0).click();

    element(by.id('expressionInput')).sendKeys('4x+5=9').then(() => {
      return element(by.css('.frontpage-generatebtn')).click();
    }).then(() => {
      element(by.css('#frontpage-output-area')).getAttribute('value').then((value) => {
        expect(value).toBe("http://localhost:8080/sandbox;ex=4x%2B5%3D9");
      }, () => {
        fail();
      });
    });
  });

  it('should chose problem solving and then write an expression, a correct answer and a wrong answer', function () {
    browser.get("/");

    element(by.css('#frontpage-dropdownmenu')).click();
    var items = element.all(by.css('.ui-dropdown-item'));
    items.get(1).click();

    element(by.id('expressionInput')).sendKeys('4x+5=9').then(() => {
      return element(by.id('correctInput')).sendKeys('1');
    }).then(() => {
      return element(by.id('wrongInput')).sendKeys('2');
    }).then(() => {
      return element(by.css('.frontpage-generatebtn')).click();
    }).then(() => {
      element(by.css('#frontpage-output-area')).getAttribute('value').then((value) => {
        expect(value).toBe("http://localhost:8080/sandbox;sp=ps;ex=4x%2B5%3D9;x=1;y=2");
      }, () => {
        fail();
      });
    });
  });

  it('should chose guide and then write JSON object and a description', function () {
    browser.get("/");

    element(by.css('#frontpage-dropdownmenu')).click();
    var items = element.all(by.css('.ui-dropdown-item'));
    items.get(2).click();
    var treeInput = `{"tree":[{"ex":"2+5=10-3"},{"tid":"0","ex":"7=10-3"},{"tid":"0","ex":"2+5=7"},{"tid":"1/2","ex":"7=7"}]}`;
    element(by.id('treeInput')).sendKeys(treeInput).then(() => {
      return element(by.id('descriptionInput')).sendKeys('This is a description');
    }).then(() => {
      return element(by.css('.frontpage-generatebtn')).click();
    }).then(() => {
      element(by.css('#frontpage-output-area')).getAttribute('value').then((value) => {
        expect(value).toBe("http://localhost:8080/sandbox;sp=gd;tree=%7B%22tree%22%3A%5B%7B" +
          "%22ex%22%3A%222%2B5%3D10$03%22%7D%2C%7B%22tid%22%3A%220%22%2C%22" +
          "ex%22%3A%227%3D10$03%22%7D%2C%7B%22tid%22%3A%220%22%2C%22ex%22%3A" +
          "%222%2B5%3D7%22%7D%2C%7B%22tid%22%3A%221%2F2%22%2C%22ex%22%3A%227%3D7%22%7D%5D%7D;desc=This%20is%20a%20description");
      }, () => {
        fail();
      });
    });
  });
});