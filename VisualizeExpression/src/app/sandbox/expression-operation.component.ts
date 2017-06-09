import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, InjectionToken, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import OperationState from './operation-state';
import { InternalNode } from "../visualization/internal-node";
import InternalData from "../visualization/internal-data";
import MathInputService from "../visualization/math-input-service";
import MATH_INPUT_SERVICE from "../visualization/math-input-service-token";
import { ExpressionOperationTextService } from "./expression-operation-text.service";
import { ButtonModule } from 'primeng/primeng';
import { ExpressionOperationService } from "./expression-operation.service";

@Component({
    selector: 'expression-operation',
    templateUrl: './expression-operation.component.html',
    styleUrls: ['./expression-operation.component.css']
})

export class ExpressionOperationComponent implements OnInit, OnChanges {
    @Input()
    operationState: OperationState;
    @Input()
    expressionData: InternalData;
    @Input()
    selectedNode: InternalNode;

    @Output()
    onApplied = new EventEmitter<InternalData>();
    @Output()
    onCanceled = new EventEmitter();

    private currentData: InternalData;
    private replacementData: InternalData;
    private input: string;
    private infoText: string;

    private timeout: number;
    private readonly TIMEOUT_LIMIT_MS: Number = 200;
    private updated: boolean;

    constructor( @Inject(MATH_INPUT_SERVICE) private mis: MathInputService, 
        private eots: ExpressionOperationTextService,
        private eos: ExpressionOperationService) {
        this.operationState = OperationState.Closed;
        this.updated = false;
    }

    ngOnInit(): void {
        this.updateInfoText();
    }

    ngOnChanges(changes: SimpleChanges): void {
        var selectedNodeChanges = changes["selectedNode"];
        if (selectedNodeChanges) {
            if (selectedNodeChanges.currentValue) {
                this.currentData = new InternalData(this.selectedNode);
            }

            this.replacementData = null;
            this.input = "";
        }

        var operationStateChanges = changes["operationState"];
        if (operationStateChanges) {
            this.updateInfoText();
        }
    }

    private onInputChange(event: Event): void {
        this.updated = false;
        this.startInputTimeout();
    }

    private startInputTimeout(): void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeOut.bind(this), this.TIMEOUT_LIMIT_MS);
    }

    private onTimeOut(): void {
        this.replacementData = this.mis.convert(this.input);
        this.updated = true;
    }

    private applyOperation(): void {
        let newData: InternalData = this.eos.applyReplacement(this.expressionData, 
                                    this.selectedNode, this.replacementData.rootNode);
        this.onApplied.emit(newData);
    }

    private cancelOperation(): void {
        this.onCanceled.emit();
    }

    private updateInfoText(): void {
        this.infoText = this.getInfoText();
    }

    private isApplyBtnDisabled(): boolean {
        if(this.input === "") {
            return true;
        }

        if(!this.replacementData) {
            return true;
        }

        return !this.updated;
    }

    private getInfoText(): string {
        switch (this.operationState) {
            case OperationState.Closed: return this.eots.getVisualizeExpressionText();
            case OperationState.Waiting: return this.eots.getSelectNodeText();
            case OperationState.Added: return this.eots.getReplacementOperationText();
            default: return this.eots.getUnexpectedProblemText();
        }
    }
}