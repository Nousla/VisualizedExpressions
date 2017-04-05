import { ElementRef } from '@angular/core';
import { InternalData } from './internal-data';

export interface IVisualizationService {
    configure(config: Object): void;
    construct(elementRef: ElementRef, data: InternalData): void;
}