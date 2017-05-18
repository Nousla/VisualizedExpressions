import { browser, element, by, Key } from 'protractor';

describe('Sandbox', () => {

    beforeEach(() => {
        browser.get("/sandbox");
    });

    it('should be on the sandbox page', () => {
        browser.getCurrentUrl().then((value: string) => {
            expect(value).toEqual(browser.baseUrl + "/sandbox");
        }, () => {
            fail();
        });
    });

    it('should visualize expression with mirror mountain', (done: DoneFn) => {
        let expression = element(by.tagName('expression'));
        let expressionInput = expression.element(by.css(".expression-edit input"));

        expressionInput.sendKeys("x=2+7").then(() => {
            setTimeout(() => {
                let expressionVisualization = expression.element(by.tagName("visualization"));
                let visualization = expressionVisualization.element(by.tagName("visualization-mirror-mountain"));
                let visualizationBox = visualization.element(by.className("mirror-mountain-box"));

                visualizationBox.getAttribute("innerHTML").then((innerHtml) => {
                    expect(innerHtml).toBeDefined();
                    done();
                }, () => {
                    fail();
                });
            }, 200);
        });
    });

    it('should update visualization with mirror mountain', (done: DoneFn) => {
        let expression = element(by.tagName('expression'));
        let expressionInput = expression.element(by.css(".expression-edit input"));

        expressionInput.sendKeys("x").then(() => {
            return expressionInput.sendKeys(Key.BACK_SPACE, "y");
        }).then(() => {
            setTimeout(() => {
                let expressionVisualization = expression.element(by.tagName("visualization"));
                let visualization = expressionVisualization.element(by.tagName("visualization-mirror-mountain"));
                let visualizationBox = visualization.element(by.className("mirror-mountain-box"));
                let nodeText = visualizationBox.element(by.css("text"));

                nodeText.getText().then((text) => {
                    expect(text).toBe("y");
                    done();
                }, () => {
                    fail();
                });
            }, 200);
        });
    });

    it('should replace expression with mirror mountain', (done: DoneFn) => {
        let expression = element(by.tagName('expression'));
        let expressionInput = expression.element(by.css(".expression-edit input"));

        let expressionVisualization = expression.element(by.tagName("visualization"));
        let visualization = expressionVisualization.element(by.tagName("visualization-mirror-mountain"));

        let firstStep = function () {
            expressionInput.sendKeys("2+7").then(() => {
                setTimeout(() => {
                    secondStep();
                }, 200);
            })
        }

        let secondStep = function () {
            let visualizationBox = visualization.element(by.className("mirror-mountain-box"));
            let visualizationRoot = visualizationBox.all(by.tagName("g")).get(0);
            let nodes = visualizationRoot.all(by.css("g"));

            nodes.get(0).click().then(() => {
                let expressionOperation = expression.element(by.tagName("expression-operation"));
                let expressionReplacement = expressionOperation.element(by.css(".expression-operation-edit input"));

                return expressionReplacement.sendKeys("9");
            }).then(() => {
                setTimeout(() => {
                    thirdStep();
                }, 200);
            });
        }

        let thirdStep = function () {
            let expressionOperation = expression.element(by.tagName("expression-operation"));
            let expressionApply = expressionOperation.element(by.className("expression-operation-apply-button"));
            expressionApply.click().then(() => {
                let newExpression = element.all(by.tagName('expression')).get(1);
                let newExpressionInput = newExpression.element(by.css(".expression-edit input"));

                newExpressionInput.getAttribute("value").then((value) => {
                    expect(value).toBe("9");
                    done();
                }, () => {
                    fail();
                });
            });
        }

        firstStep();
    });

    it('should cancel replace operation with mirror mountain', (done: DoneFn) => {
        let expression = element(by.tagName('expression'));
        let expressionInput = expression.element(by.css(".expression-edit input"));

        let expressionVisualization = expression.element(by.tagName("visualization"));
        let visualization = expressionVisualization.element(by.tagName("visualization-mirror-mountain"));

        let firstStep = function () {
            expressionInput.sendKeys("2+7").then(() => {
                setTimeout(() => {
                    secondStep();
                }, 200);
            })
        }

        let secondStep = function () {
            let visualizationBox = visualization.element(by.className("mirror-mountain-box"));
            let visualizationRoot = visualizationBox.all(by.tagName("g")).get(0);
            let nodes = visualizationRoot.all(by.css("g"));

            nodes.get(0).click().then(() => {
                thirdStep();
            });
        }

        let thirdStep = function () {
            let expressionOperation = expression.element(by.tagName("expression-operation"));
            let expressionCancel = expressionOperation.element(by.className("expression-operation-cancel-button"));
            expressionCancel.click().then(() => {
                let expressions = element.all(by.tagName('expression'));

                expressions.count().then((value) => {
                    expect(value).toBe(1);
                    done();
                }, () => {
                    fail();
                });
            });
        }

        firstStep();
    });
});