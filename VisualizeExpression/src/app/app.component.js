"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
        this.graphData = [
            {
                "name": "root",
                "value": "=",
                "type": "equality",
                "children": [
                    {
                        "name": "node1",
                        "value": "+",
                        "type": "addition",
                        "children": [
                            {
                                "name": "node1.1",
                                "value": "5",
                                "type": "number"
                            },
                            {
                                "name": "node1.2",
                                "value": "-",
                                "type": "subtraction",
                                "children": [
                                    {
                                        "name": "node1.2.1",
                                        "value": "8",
                                        "type": "number"
                                    },
                                    {
                                        "name": "node1.2.2",
                                        "value": "12",
                                        "type": "number"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "node2",
                        "value": "*",
                        "type": "multiplication",
                        "children": [
                            {
                                "name": "node2.1",
                                "value": "7",
                                "type": "number"
                            },
                            {
                                "name": "node2.2",
                                "value": "/",
                                "type": "division",
                                "children": [
                                    {
                                        "name": "node2.2.1",
                                        "value": "6",
                                        "type": "number"
                                    },
                                    {
                                        "name": "node2.2.2",
                                        "value": "x",
                                        "type": "variable"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: "<h1>Test</h1>\n             <visualization [data]=graphData></visualization>",
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map