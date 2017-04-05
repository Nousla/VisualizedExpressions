import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpressionService {

    private expressionNewSource = new Subject<void>();

    expressionNew$ = this.expressionNewSource.asObservable();

    addNew() {
        this.expressionNewSource.next();
    }
}