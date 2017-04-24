import { Injectable } from "@angular/core";
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import { GuideTree } from "./guide-tree";
import { GuideTreeService } from "./guide-tree.service";

@Injectable()
export class ImportExpressionService {
    private _importedGuideTree: GuideTree;

    constructor(private route: ActivatedRoute, private gts: GuideTreeService) {
        if (this.importedSpecifier === 'gd' && this.importedExpression) {
            this._importedGuideTree = this.gts.generateGuideTree(this.importedExpression);
        }
    }

    get importedSpecifier(): string { return this.route.snapshot.params['sp'] };
    get importedExpression(): string { return this.route.snapshot.params['ex'] };
    get importedCorrectSolution(): number { return this.route.snapshot.params['x'] };
    get importedWrongSolution(): number { return this.route.snapshot.params['y'] };
    get importedGuideTree(): GuideTree { return this._importedGuideTree };
}

export default ImportExpressionService;