import { Injectable } from "@angular/core";
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';

@Injectable()
export class ImportExpressionService{

    private _importedSpecifier: string;
    private _importedExpression: string;
    private _importedCorrectSolution: number;
    private _importedWrongSolution: number;

    constructor(private route: ActivatedRoute){}

    get importedSpecifier(): string{return this.route.snapshot.params['sp']};
    get importedExpression(): string{return this.route.snapshot.params['ex']};
    get importedCorrectSolution(): number{return this.route.snapshot.params['x']};
    get importedWrongSolution(): number{return this.route.snapshot.params['y']};
}