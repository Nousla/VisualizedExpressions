import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionService {

    private expressionNewSource = new Subject();
    private expressionRemoveSource = new Subject<number>();

    expressionNew$ = this.expressionNewSource.asObservable();
    expresionRemove$ = this.expressionRemoveSource.asObservable();

    addNew() {
        this.expressionNewSource.next();
    }

    remove(counter: number){
        this.expressionRemoveSource.next(counter);
    }
}