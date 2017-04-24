import { InternalNode } from '../visualization/internal-node';
import VisualizationEventHandler from '../visualization/visualization-event-handler';
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";

@Injectable()
class ExpressionEventHandler implements VisualizationEventHandler {
    private visualizationSelectNodeSource = new Subject<InternalNode>();

    visualizationSelectNode$ = this.visualizationSelectNodeSource.asObservable();

    selectNode(data: InternalNode): void {
        this.visualizationSelectNodeSource.next(data);
    }
}

export default ExpressionEventHandler;