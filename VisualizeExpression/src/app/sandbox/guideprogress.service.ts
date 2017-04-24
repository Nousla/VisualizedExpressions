import { Injectable } from "@angular/core";
import { GuideTree, GuideNode } from "./guide-tree";


@Injectable()
export class GuideProgressService {

    checkGuide(ex: string, tree: GuideTree): boolean {
        var inputExpression = ex.replace(" ", "");
        var splitExpressions = inputExpression.split("=");
        var leftsideToCheck = splitExpressions[0];
        var rightsideToCheck = splitExpressions[1];
        if (this.traverseNodes(tree.activeNode, leftsideToCheck, rightsideToCheck) == true) {
            return true;
        } else {
            if (!tree.path || tree.path.length === 0) { return false }
            for (var i = 0; i < tree.path.length; i++) {
                if (i != tree.activePath) {
                    var check = this.traverseNodes(tree.path[i], leftsideToCheck, rightsideToCheck);
                    if(check){ return true }
                }
            }
        }
        return false;
    }

    private traverseNodes(node: GuideNode, leftsideToCheck: string, rightsideToCheck: string): boolean {
        if (!node) {
            return false;
        }
        var nodeExpression = node.expression.replace(" ", "");
        var splitNodeExpressions = nodeExpression.split("=");
        var leftsideNode = splitNodeExpressions[0];
        var rightsideNode = splitNodeExpressions[1];


        if (leftsideToCheck === leftsideNode && rightsideToCheck === rightsideNode) {
            return true;
        } else if (leftsideToCheck === rightsideNode && rightsideToCheck === leftsideNode) {
            return true;
        } else {
            if (!node.children) {
                return false;
            }

            for (var i = 0; i < node.children.length; i++) {
                this.traverseNodes(node.children[i], leftsideToCheck, rightsideToCheck);
            }
        }
    }
}