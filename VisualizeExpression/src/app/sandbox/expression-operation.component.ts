import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import { InternalData } from "../visualization/internal-data";

@Component({
    selector: 'expression-operation',
    templateUrl: './expression-operation.component.html',
    styleUrls: ['./expression-operation.component.css']
})

export class ExpressionOperationComponent implements OnChanges {
    @Input()
    operationState: OperationState;
    @Input()
    selectedNode: InternalNode;

    @Output()
    onOperationApplied = new EventEmitter();

    private data: InternalData;

    ngOnChanges(changes: SimpleChanges): void {
        var selectedNodeChanges = changes["selectedNode"];
        if(selectedNodeChanges) {
            this.data = new InternalData(this.selectedNode);
        }
    }

    applyOperation(): void {

    }
}