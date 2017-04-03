"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var internal_data_1 = require("./internal-data");
var AppComponent = (function () {
    function AppComponent() {
        this.graphData = new internal_data_1.InternalData([
            {
                "name": "=",
                "type": "equality",
                "group": "operator",
                "children": [
                    {
                        "name": "+",
                        "type": "addition",
                        "group": "operator",
                        "children": [
                            {
                                "name": "5",
                                "type": "integer",
                                "group": "number"
                            },
                            {
                                "name": "-",
                                "type": "subtraction",
                                "group": "operator",
                                "children": [
                                    {
                                        "name": "8",
                                        "type": "integer",
                                        "group": "number"
                                    },
                                    {
                                        "name": "12",
                                        "type": "integer",
                                        "group": "number"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "name": "*",
                        "type": "multiplication",
                        "group": "operator",
                        "children": [
                            {
                                "name": "+",
                                "type": "addition",
                                "group": "operator",
                                "children": [
                                    {
                                        "name": "7.4",
                                        "type": "decimal",
                                        "group": "number",
                                    },
                                    {
                                        "name": "-",
                                        "type": "subtraction",
                                        "group": "operator",
                                        "children": [
                                            {
                                                "name": "2.5",
                                                "type": "decimal",
                                                "group": "number",
                                            },
                                            {
                                                "name": "25",
                                                "type": "integer",
                                                "group": "number",
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "name": "/",
                                "type": "division",
                                "group": "operator",
                                "children": [
                                    {
                                        "name": "6",
                                        "type": "integer",
                                        "group": "number"
                                    },
                                    {
                                        "name": "x",
                                        "type": "variable",
                                        "group": "extended"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
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