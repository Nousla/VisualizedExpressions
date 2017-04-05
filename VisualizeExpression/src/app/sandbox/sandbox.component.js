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
var expression_component_1 = require("./expression.component");
var expression_service_1 = require("./expression.service");
var SandboxComponent = (function () {
    function SandboxComponent(resolver, expressionService) {
        this.resolver = resolver;
        this.expressionService = expressionService;
        this.subscription = expressionService.expressionNew$.subscribe(this.onAddNewExpression.bind(this));
    }
    SandboxComponent.prototype.ngOnInit = function () {
        var factory = this.resolver.resolveComponentFactory(expression_component_1.ExpressionComponent);
        this.container.createComponent(factory);
    };
    SandboxComponent.prototype.onAddNewExpression = function () {
        var factory = this.resolver.resolveComponentFactory(expression_component_1.ExpressionComponent);
        this.container.createComponent(factory);
    };
    return SandboxComponent;
}());
__decorate([
    core_1.ViewChild("submitted_expression_box", { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], SandboxComponent.prototype, "container", void 0);
SandboxComponent = __decorate([
    core_1.Component({
        selector: 'sandbox',
        templateUrl: './sandbox.html',
        styleUrls: ['./sandbox.css'],
        providers: [expression_service_1.ExpressionService]
    }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver, expression_service_1.ExpressionService])
], SandboxComponent);
exports.SandboxComponent = SandboxComponent;
//# sourceMappingURL=sandbox.component.js.map