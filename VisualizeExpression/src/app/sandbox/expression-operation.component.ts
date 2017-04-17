import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, InjectionToken, Inject, OnInit } from '@angular/core';
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

export class ExpressionOperationComponent implements OnInit, OnChanges {
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
    private infoText: string;

    private timeout: number;
    private readonly TIMEOUT_LIMIT_MS: Number = 200;
    private updated: boolean;

    private readonly TEXT_VISUALIZE_EXPRESSION: string = "Visualize an expression to add operations";
    private readonly TEXT_SELECT_NODE = "Select a node in the visualization to add an operation";
    private readonly TEXT_REPLACEMENT_OPERATION = "Replacement operation added to node. "
    + "Input the replacement expression and click apply, or click cancel to remove the operation";
    private readonly TEXT_UNEXPECTED_PROBLEM = "An unexpected problem has occurred";

    constructor( @Inject(MATH_INPUT_SERVICE) private mis: MathInputService) {
        this.operationState = OperationState.Closed;
    }

    ngOnInit(): void {
        this.updateInfoText();
    }

    ngOnChanges(changes: SimpleChanges): void {
        var selectedNodeChanges = changes["selectedNode"];
        if (selectedNodeChanges) {
            this.currentData = new InternalData(this.selectedNode);
            this.newData = null;
            this.input = "";
        }

        var operationStateChanges = changes["operationState"];
        if(operationStateChanges) {
            this.updateInfoText();
        }
    }

    onInputChange(event: Event): void {
        this.updated = false;
        this.startInputTimeout();
    }

    startInputTimeout(): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), this.TIMEOUT_LIMIT_MS);
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

    updateInfoText(): void {
        this.infoText = this.getInfoText();
    }

    getInfoText(): string {
        switch (this.operationState) {
            case OperationState.Closed: return this.TEXT_VISUALIZE_EXPRESSION;
            case OperationState.Waiting: return this.TEXT_SELECT_NODE;
            case OperationState.Added: return this.TEXT_REPLACEMENT_OPERATION;
            default: return this.TEXT_UNEXPECTED_PROBLEM;
        }
    }
}