import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionService {

    private expressionNewSource = new Subject();
    private expressionRemoveSource = new Subject<number>();
    private expressionCloneSource = new Subject<Object>();

    expressionNew$ = this.expressionNewSource.asObservable();
    expresionRemove$ = this.expressionRemoveSource.asObservable();
    expressionClone$ = this.expressionCloneSource.asObservable();

    addNew() {
        this.expressionNewSource.next();
    }

    remove(counter: number) {
        this.expressionRemoveSource.next(counter);
    }
    clone(expression: Object) {
        this.expressionCloneSource.next(expression);
    }
}