import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VisualizationComponent } from './visualization.component';
import { MirrorMountainComponent } from './mirror-mountain/mirror-mountain.component';

describe('VisualizationComponent suite', () => {
    var component: VisualizationComponent;
    var componentFixture: ComponentFixture<VisualizationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisualizationComponent, MirrorMountainComponent]
        });

        componentFixture = TestBed.createComponent(VisualizationComponent);
        component = componentFixture.componentInstance;
    });

    it('should create component', () => {
        expect(component).toBeDefined();
    });
});