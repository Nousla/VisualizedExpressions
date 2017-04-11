import { InternalNode } from './internal-node';

interface VisualizationEventHandler {
    selectNode(data: InternalNode): void;
}

export default VisualizationEventHandler;