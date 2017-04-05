"use strict";
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var mirror_mountain_component_1 = require("./mirror-mountain.component");
describe('MirrorMountainComponent suite', function () {
    var component;
    var componentFixture;
    var debugElement;
    var htmlElement;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [mirror_mountain_component_1.MirrorMountainComponent]
        });
        componentFixture = testing_1.TestBed.createComponent(mirror_mountain_component_1.MirrorMountainComponent);
        component = componentFixture.componentInstance;
        debugElement = componentFixture.debugElement.query(platform_browser_1.By.css(".chartContainer"));
        htmlElement = debugElement.nativeElement;
    });
    it('should create component', function () {
        expect(component).toBeDefined();
    });
    it('should display nothing if no data', function () {
        componentFixture.detectChanges();
        expect(htmlElement.innerHTML).toBeNull();
    });
});
//# sourceMappingURL=mirror-mountain.component.spec.js.map