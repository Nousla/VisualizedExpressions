import { Injectable } from "@angular/core";
import { GuideTree, GuideNode } from "./guide-tree";
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";


@Injectable()
export class GuideProgressService {

    checkGuide(ex: string, tree: GuideTree): boolean {
        if (!tree) { throw new UndefinedArgumentException("tree is undefined") }

        var inputExpression = ex.replace(" ", "");
        var splitExpressions = inputExpression.split("=");
        var leftsideToCheck = splitExpressions[0];
        var rightsideToCheck = splitExpressions[1];

        if (!tree.paths || tree.paths.length === 0) { return false }

        var rootCheck = this.checkNode(tree.rootNode, leftsideToCheck, rightsideToCheck);
        if(rootCheck) {
            return true;
        }

        if (tree.activePath && tree.activePath >= 0 && this.traverseNodes(tree.paths[tree.activePath], leftsideToCheck, rightsideToCheck) == true) {
            return true;
        } else {
            for (var i = 0; i < tree.paths.length; i++) {
                if (!tree.activePath || i != tree.activePath) {
                    var check = this.traverseNodes(tree.paths[i], leftsideToCheck, rightsideToCheck);
                    if (check) { return true }
                }
            }
        }
        return false;
    }

    private traverseNodes(node: GuideNode, leftsideToCheck: string, rightsideToCheck: string): boolean {
        if (!node) {
            return false;
        }

        var check = this.checkNode(node, leftsideToCheck, rightsideToCheck);
        if (check) {
            return true;
        }

        if (!node.children) {
            return false;
        }

        for (let i = 0; i < node.children.length; i++) {
            let check = this.traverseNodes(node.children[i], leftsideToCheck, rightsideToCheck);
            if (check) {
                return true
            }
        }
    }

    private checkNode(node: GuideNode, leftsideToCheck: string, rightsideToCheck: string): boolean {
        var nodeExpression = node.expression.replace(" ", "");
        var splitNodeExpressions = nodeExpression.split("=");
        var leftsideNode = splitNodeExpressions[0];
        var rightsideNode = splitNodeExpressions[1];

        if (leftsideToCheck === leftsideNode && rightsideToCheck === rightsideNode) {
            return true;
        } else if (leftsideToCheck === rightsideNode && rightsideToCheck === leftsideNode) {
            return true;
        }

        return false;
    }
}