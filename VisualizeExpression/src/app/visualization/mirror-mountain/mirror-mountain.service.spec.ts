import { MirrorMountainService } from "./mirror-mountain.service";
import { UndefinedArgumentException } from "../../exceptions/undefined-argument-exception";
import { ElementRef } from "@angular/core/";
import { InternalData } from "../internal-data";
import { InternalNode } from "../internal-node";
import VisualizationEventHandler from '../visualization-event-handler';

describe('Mirror Mountain Service suite', () => {
    var service: MirrorMountainService;

    beforeEach(() => {
        service = new MirrorMountainService();
    });

    it('#visualize should fail at undefined element reference', () => {
        let mockInternalData: InternalData = new InternalData(new InternalNode());
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();
        let exception: UndefinedArgumentException = new UndefinedArgumentException("elementRef");

        let visualizeFunction = () => {
            service.visualize(undefined, mockInternalData, mockEventHandler);
        }

        expect(visualizeFunction).toThrowError(UndefinedArgumentException);
    });

    it('#visualize should fail at undefined internal data reference', () => {
        let mockElementRef: ElementRef = new ElementRef({});
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        let visualizeFunction = () => {
            service.visualize(mockElementRef, undefined, mockEventHandler);
        }

        expect(visualizeFunction).toThrowError(UndefinedArgumentException);
    });

    it('#visualize should clear existing content', () => {
        let mockElementRef: ElementRef = new ElementRef({});
        let mockEventHandler: MockEmptyVisualizationHandler = new MockEmptyVisualizationHandler();

        let visualizeFunction = () => {
            service.visualize(mockElementRef, undefined, mockEventHandler);
        }

        expect(visualizeFunction).toThrowError(UndefinedArgumentException);
    });
});

class MockEmptyVisualizationHandler implements VisualizationEventHandler {
    selectNode(data: InternalNode): void {}
}