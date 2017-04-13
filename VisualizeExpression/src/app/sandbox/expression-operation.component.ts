import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, InjectionToken, Inject } from '@angular/core';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import { InternalData } from "../visualization/internal-data";
import { MathConverterService } from "../visualization/math-converter-service";
import { MathTextConverterService } from "../visualization/math-text-converter.service";
import { MATH_CONVERTER_SERVICE } from "../visualization/math-text-convert-service-token";

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

    constructor( @Inject(MATH_CONVERTER_SERVICE) private mcs: MathConverterService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        var selectedNodeChanges = changes["selectedNode"];
        if (selectedNodeChanges) {
            this.currentData = new InternalData(this.selectedNode);
        }
    }

    onInputChange(event: Event): void {
        this.updated = false;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), 200);
    }

    onTimeOut(): void {
        this.newData = this.mcs.convert(this.input);
        this.updated = true;
    }

    applyOperation(): void {
        if(!this.updated) {
            clearTimeout(this.timeout);
            this.onTimeOut();
        }

        this.onApplied.emit(this.newData.rootNode);
    }

    cancelOperation(): void {
        this.onCanceled.emit();
    }
}