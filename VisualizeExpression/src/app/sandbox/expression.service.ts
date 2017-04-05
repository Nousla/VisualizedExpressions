import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionService {

    private expressionNewSource = new Subject<void>();
    private expressionRemoveSource = new Subject<void>();

    expressionNew$ = this.expressionNewSource.asObservable();
    expresionRemove$ = this.expressionRemoveSource.asObservable();

    addNew() {
        this.expressionNewSource.next();
    }

    remove(){
        this.expressionRemoveSource.next();
    }
}