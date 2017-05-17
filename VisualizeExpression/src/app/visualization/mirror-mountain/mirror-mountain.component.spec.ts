import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MirrorMountainComponent } from './mirror-mountain.component';
import { VISUALIZATION_SERVICE } from "../visualization-injection-token";
import { MirrorMountainService } from "./mirror-mountain.service";

describe('Mirror Mountain Component suite', () => {
    var component: MirrorMountainComponent;
    var componentFixture: ComponentFixture<MirrorMountainComponent>;
    var debugElement: DebugElement;
    var htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MirrorMountainComponent],
            providers: [
                { provide: VISUALIZATION_SERVICE, useFactory: () => {return {} }}
            ]
        });

        componentFixture = TestBed.createComponent(MirrorMountainComponent);
        component = componentFixture.componentInstance;

        debugElement = componentFixture.debugElement;
        htmlElement = debugElement.nativeElement;
    });

    it('should create component', () => {
        expect(component).toBeDefined();
    });

    it('should display nothing if no data', () => {
        componentFixture.detectChanges();
        expect(htmlElement.querySelector(".mirror-mountain-box").innerHTML).toBe('');
    });
});