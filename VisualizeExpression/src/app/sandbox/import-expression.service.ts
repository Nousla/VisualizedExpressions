import { Injectable } from "@angular/core";
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import { GuideTree } from "./guide-tree";
import { GuideTreeService } from "./guide-tree.service";
import { EncodeService } from '../encode.service';

@Injectable()
export class ImportExpressionService {
    private _importedGuideTree: GuideTree;
    private _decodedExpression: string;
    private _decodedTree: string;
    private _decodedCorrectSolution: string;
    private _decodedWrongSolution: string;

    constructor(private route: ActivatedRoute, private gts: GuideTreeService, private encodeService: EncodeService) {
        this._decodedExpression = encodeService.decodeURL(this.route.snapshot.params['ex']);
        this._decodedTree = encodeService.decodeURL(this.route.snapshot.params['tree']);
        this._decodedCorrectSolution = encodeService.decodeURL(this.route.snapshot.params['x']);
        this._decodedWrongSolution = encodeService.decodeURL(this.route.snapshot.params['y']);


        if (this.importedSpecifier === 'gd' && this.importedTree) {
            this._importedGuideTree = this.gts.generateGuideTree(this.importedTree);
        }

    }

    get importedSpecifier(): string { return this.route.snapshot.params['sp'] };
    get importedExpression(): string { return this._decodedExpression };
    get importedTree(): string { return this._decodedTree };
    get importedCorrectSolution(): string { return this._decodedCorrectSolution };
    get importedWrongSolution(): string { return this._decodedWrongSolution };
    get importedGuideTree(): GuideTree { return this._importedGuideTree };
}

export default ImportExpressionService;