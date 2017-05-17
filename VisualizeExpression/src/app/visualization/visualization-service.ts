import { ElementRef } from '@angular/core';
import { InternalData } from './internal-data';
import VisualizationEventHandler from './visualization-event-handler';

interface VisualizationService {
    configure(config: Object): void;
    visualize(elementRef: ElementRef, data: InternalData, eventHandler: VisualizationEventHandler): void;
}

export default VisualizationService;