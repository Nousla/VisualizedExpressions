import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MirrorMountainComponent } from './mirror-mountain.component';

describe('MirrorMountainComponent suite', () => {
    var component: MirrorMountainComponent;
    var componentFixture: ComponentFixture<MirrorMountainComponent>;
    var debugElement: DebugElement;
    var htmlElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MirrorMountainComponent]
        });

        componentFixture = TestBed.createComponent(MirrorMountainComponent);
        component = componentFixture.componentInstance;

        debugElement = componentFixture.debugElement.query(By.css(".chartContainer"));
        htmlElement = debugElement.nativeElement;
    });

    it('should create component', () => {
        expect(component).toBeDefined();
    });

    it('should display nothing if no data', () => {
        componentFixture.detectChanges();
        expect(htmlElement.innerHTML).toBeNull();
    });
});