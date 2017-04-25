import { Injectable } from "@angular/core";
import { GuideTree, GuideNode } from "./guide-tree";
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";


@Injectable()
export class GuideProgressService {

    checkGuide(ex: string, tree: GuideTree): boolean {
        if(!tree){ throw new UndefinedArgumentException("tree is undefined") }
        var inputExpression = ex.replace(" ", "");
        var splitExpressions = inputExpression.split("=");
        if (this.traverseNodes(tree.path[tree.activePath], splitExpressions, tree.activePath, tree) == true) {
            return true;
        } else {
            if (!tree.path || tree.path.length === 0) { return false }
            for (var i = 0; i < tree.path.length; i++) {
                if (i != tree.activePath) {
                    var check = this.traverseNodes(tree.path[i], splitExpressions, i, tree);
                    if(check){ return true }
                }
            }
        }
        return false;
    }

    private traverseNodes(node: GuideNode, splitExpressions: string[], currentpath: number, tree: GuideTree): boolean {
        if (!node) {
            return false;
        }
        var nodeExpression = node.expression.replace(" ", "");
        var splitNodeExpressions = nodeExpression.split("=");

        if(splitExpressions[0] === splitNodeExpressions[0] && !splitExpressions[1] && !splitNodeExpressions[1]){
            tree.path[currentpath] = node;
            return true;
        } else if (splitExpressions[0] === splitNodeExpressions[0] && splitExpressions[1] === splitNodeExpressions[1]) {
            tree.path[currentpath] = node;
            return true;
        } else if (splitExpressions[0] === splitNodeExpressions[1] && splitExpressions[1] === splitNodeExpressions[0]) {
            tree.path[currentpath] = node;
            return true;
        } else {
            if (!node.children) {
                return false;
            }

            for (var i = 0; i < node.children.length; i++) {
                this.traverseNodes(node.children[i], splitExpressions, i, tree);
            }
        }
    }
}