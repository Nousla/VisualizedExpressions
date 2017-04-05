"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var expression_service_1 = require("./expression.service");
var ExpressionComponent = ExpressionComponent_1 = (function () {
    function ExpressionComponent(es) {
        this.es = es;
        this.counter1 = ExpressionComponent_1.counter++;
    }
    ExpressionComponent.prototype.click = function () {
        this.es.addNew();
    };
    return ExpressionComponent;
}());
ExpressionComponent.counter = 1;
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], ExpressionComponent.prototype, "counter1", void 0);
ExpressionComponent = ExpressionComponent_1 = __decorate([
    core_1.Component({
        selector: 'expression',
        template: "\n        <div class=\"expression_box\">\n            <div class=\"expression_actions\">\n                <p>{{counter1}}</p>\n                <button (click)=\"click()\">Insert New</button>\n                <button>Clone</button>\n                <button>Remove</button>\n                <button>Move up</button>\n                <button>Move down</button>\n            </div>\n            <div class=\"expression_edit\">\n                <textarea rows=\"1\">Insert expression here</textarea>\n            </div>\n            <div class=\"visualization_render\">\n                <img src=\"\" alt=\"Syntax tree visualization\" />\n            </div>\n            <div class=\"expression\" id=\"expression_2\"></div>\n        </div>\n    ",
        styleUrls: ["./expression.component.css"]
    }),
    __metadata("design:paramtypes", [expression_service_1.ExpressionService])
], ExpressionComponent);
exports.ExpressionComponent = ExpressionComponent;
var ExpressionComponent_1;
//# sourceMappingURL=expression.component.js.map