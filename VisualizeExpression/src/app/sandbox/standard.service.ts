import { Injectable, Component } from '@angular/core';
import { ExpressionComponent } from './expression.component';
import { ExpressionService } from './expression.service';


@Injectable()
export class StandardService {
    private _expressions: string[];

    constructor() {
        this._expressions = [];
    }

    addExpression(expression: string): void {
        this.expressions.push(expression);
    }

    addEmptyExpression(): void {
        this.expressions.push("");
    }

    get expressions() {
        return this._expressions;
    }

    setExpression(index: number, value: string): void {
        if (index >= 0 && index <= this.expressions.length - 1) {
            this.expressions[index] = value;
        }
    }

    removeExpression(index: number) {
        if (index >= 0) {
            this.expressions.splice(index, 1);
            if (this.expressions.length == 0) {
                this.addEmptyExpression();
            }
        }
    }

    cloneExpression(expression: Object) {
        this.addExpression(expression["input"]);
    }

    onMoveUpExpression(index: number): void {
        if (index > 0) {
            this.swapExpressions(index, index - 1);
        }
    }

    onMoveDownExpression(index: number): void {
        if (index < this.expressions.length - 1) {
            this.swapExpressions(index, index + 1);
        }
    }

    private swapExpressions(sourceIndex: number, targetIndex: number): void {
        var sourceElement = this.expressions[sourceIndex];
        if (!sourceElement) {
            return;
        }

        var targetElement = this.expressions[targetIndex];

        if (!targetElement) {
            return;
        }


        this.expressions[sourceIndex] = targetElement;
        this.expressions[targetIndex] = sourceElement;
    }
}