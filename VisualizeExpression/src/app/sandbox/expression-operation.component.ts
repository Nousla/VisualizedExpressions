import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, InjectionToken, Inject } from '@angular/core';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import InternalData from "../visualization/internal-data";
import MathInputService from "../visualization/math-input-service";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";

@Component({
    selector: 'expression-operation',
    templateUrl: './expression-operation.component.html',
    styleUrls: ['./expression-operation.component.css'],
})

export class ExpressionOperationComponent implements OnChanges {
    @Input()
    operationState: OperationState;
    @Input()
    selectedNode: InternalNode;

    @Output()
    onApplied = new EventEmitter<InternalNode>();
    @Output()
    onCanceled = new EventEmitter();

    private currentData: InternalData;
    private newData: InternalData;
    private input: string;
    private timeout: number;
    private updated: boolean;

    constructor( @Inject(MATH_INPUT_SERVICE) private mis: MathInputService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        var selectedNodeChanges = changes["selectedNode"];
        if (selectedNodeChanges) {
            this.currentData = new InternalData(this.selectedNode);
            this.newData = null;
            this.input = "";
        }
    }

    onInputChange(event: Event): void {
        this.updated = false;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), 200);
    }

    onTimeOut(): void {
        this.newData = this.mis.convert(this.input);
        this.updated = true;
    }

    applyOperation(): void {
        if (!this.updated) {
            clearTimeout(this.timeout);
            this.onTimeOut();
        }

        if (this.newData) {
            this.onApplied.emit(this.newData.rootNode);
        }
        else {
            // Show error message,
            // or indicate impossible action
        }
    }

    cancelOperation(): void {
        this.onCanceled.emit();
    }
}