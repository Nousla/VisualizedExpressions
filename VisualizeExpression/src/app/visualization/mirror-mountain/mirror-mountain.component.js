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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var internal_data_1 = require("../internal-data");
var mirror_mountain_service_1 = require("./mirror-mountain.service");
var mirror_mountain_config_1 = require("./mirror-mountain-config");
exports.VISUALIZATION_SERVICE = new core_1.InjectionToken("VisualizationServiceToken");
var MirrorMountainComponent = (function () {
    function MirrorMountainComponent(visualizationService) {
        this.visualizationService = visualizationService;
    }
    MirrorMountainComponent.prototype.ngOnInit = function () {
        this.createChart();
    };
    MirrorMountainComponent.prototype.createChart = function () {
        if (!this.data) {
            return;
        }
        this.visualizationService.construct(this.chartContainer, this.data);
    };
    return MirrorMountainComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", internal_data_1.InternalData)
], MirrorMountainComponent.prototype, "data", void 0);
__decorate([
    core_1.ViewChild('chartContainer'),
    __metadata("design:type", core_1.ElementRef)
], MirrorMountainComponent.prototype, "chartContainer", void 0);
MirrorMountainComponent = __decorate([
    core_1.Component({
        selector: 'visualization-mirror-mountain',
        template: '<div class="chartContainer" #chartContainer></div>',
        styleUrls: ['./mirror-mountain.component.css'],
        encapsulation: core_1.ViewEncapsulation.None,
        providers: [
            {
                provide: exports.VISUALIZATION_SERVICE,
                useFactory: function () {
                    var config = new mirror_mountain_config_1.MirrorMountainConfig();
                    var service = new mirror_mountain_service_1.MirrorMountainService();
                    service.configure(config);
                    return new mirror_mountain_service_1.MirrorMountainService();
                }
            }
        ]
    }),
    __param(0, core_1.Inject(exports.VISUALIZATION_SERVICE)),
    __metadata("design:paramtypes", [Object])
], MirrorMountainComponent);
exports.MirrorMountainComponent = MirrorMountainComponent;
//# sourceMappingURL=mirror-mountain.component.js.map