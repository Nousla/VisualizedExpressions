import { ElementRef } from '@angular/core';
import { InternalData } from './internal-data';

interface VisualizationService {
    configure(config: Object): void;
    construct(elementRef: ElementRef, data: InternalData): void;
}

export default VisualizationService;