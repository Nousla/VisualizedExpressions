import { Component, Input } from '@angular/core';
import OperationState from './operation-state';

@Component({
    selector: 'expression-operation',
    templateUrl: './expression-operation.component.html',
    styleUrls: ['./expression-operation.component.css']
})

export class ExpressionOperationComponent {
    @Input()
    operationState: OperationState;
}