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
var d3 = require("d3");
var VisualizationComponent = (function () {
    function VisualizationComponent() {
    }
    VisualizationComponent.prototype.ngOnInit = function () {
        this.createChart();
    };
    VisualizationComponent.prototype.ngOnChanges = function () {
        /*if (this.graph) {
          this.updateChart();
        }*/
    };
    VisualizationComponent.prototype.createChart = function () {
        var margin = { top: 20, right: 120, bottom: 20, left: 120 }, width = 960 - margin.right - margin.left, height = 500 - margin.top - margin.bottom;
        var nodes = d3.hierarchy(this.data);
        console.log(nodes);
    };
    return VisualizationComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], VisualizationComponent.prototype, "data", void 0);
__decorate([
    core_1.ViewChild('graph'),
    __metadata("design:type", core_1.ElementRef)
], VisualizationComponent.prototype, "graph", void 0);
VisualizationComponent = __decorate([
    core_1.Component({
        selector: 'visualization',
        template: "<div class=\"chart\" #graph></div>",
        styleUrls: ['./visualization.component.css']
    })
], VisualizationComponent);
exports.VisualizationComponent = VisualizationComponent;
//# sourceMappingURL=visualization.component.js.map