import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionService {

    private expressionNewSource = new Subject();
    private expressionRemoveSource = new Subject<number>();
    private expressionCloneSource = new Subject<Object>();
    private expressionGuideSuccessSource = new Subject();

    expressionNew$ = this.expressionNewSource.asObservable();
    expresionRemove$ = this.expressionRemoveSource.asObservable();
    expressionClone$ = this.expressionCloneSource.asObservable();
    expressionGuideSuccess$ = this.expressionGuideSuccessSource.asObservable();

    addNew() {
        this.expressionNewSource.next();
    }

    remove(counter: number){
        this.expressionRemoveSource.next(counter);
    }
    clone(expression: Object){
        this.expressionCloneSource.next(expression);
    }

    guideSuccess(){
        this.expressionGuideSuccessSource.next();
    }
}