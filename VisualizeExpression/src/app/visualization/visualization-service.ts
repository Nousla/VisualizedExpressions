import { ElementRef } from '@angular/core';
import { InternalData } from './internal-data';
import VisualizationEventHandler from './visualization-event-handler';

interface VisualizationService {
    configure(config: Object, eventHandler: VisualizationEventHandler): void;
    construct(elementRef: ElementRef, data: InternalData): void;
}

export default VisualizationService;