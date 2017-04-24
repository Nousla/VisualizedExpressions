import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionEventService {

    private expressionAddNewSource = new Subject();
    private expressionAddSource = new Subject<string>();
    private expressionRemoveSource = new Subject<number>();
    private expressionCloneSource = new Subject<string>();
    private expressionMoveUpSource = new Subject<number>();
    private expressionMoveDownSource = new Subject<number>();

    expressionAddNew$ = this.expressionAddNewSource.asObservable();
    expressionAdd$ = this.expressionAddSource.asObservable();
    expresionRemove$ = this.expressionRemoveSource.asObservable();
    expressionClone$ = this.expressionCloneSource.asObservable();
    expressionMoveUp = this.expressionMoveUpSource.asObservable();
    expressionMoveDown = this.expressionMoveDownSource.asObservable();

    addNewExpression(): void {
        this.expressionAddNewSource.next();
    }

    addExpression(input: string) {
        this.expressionAddSource.next(input);
    }

    removeExpression(index: number): void {
        this.expressionRemoveSource.next(index);
    }

    cloneExpression(input: string): void {
        this.expressionCloneSource.next(input);
    }

    moveExpressionUp(index: number): void {
        this.expressionMoveUpSource.next(index);
    }

    moveExpressionDown(index: number): void {
        this.expressionMoveDownSource.next(index);
    }
}