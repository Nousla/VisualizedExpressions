import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionEventService {

    private expressionAddNewSource = new Subject();
    private expressionAddSource = new Subject<string>();    
    private expressionRemoveSource = new Subject<number>();
    private expressionCloneSource = new Subject<Object>();

    expressionAddNew$ = this.expressionAddNewSource.asObservable();
    expressionAdd$ = this.expressionAddSource.asObservable();
    expresionRemove$ = this.expressionRemoveSource.asObservable();
    expressionClone$ = this.expressionCloneSource.asObservable();

    addNew(): void {
        this.expressionAddNewSource.next();
    }

    add(input: string) {
        this.expressionAddSource.next(input);
    }

    remove(counter: number): void {
        this.expressionRemoveSource.next(counter);
    }

    clone(expression: Object): void {
        this.expressionCloneSource.next(expression);
    }
}