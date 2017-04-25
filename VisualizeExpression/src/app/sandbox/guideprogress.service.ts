import { Injectable } from "@angular/core";
import { GuideTree, GuideNode } from "./guide-tree";
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";


@Injectable()
export class GuideProgressService {

    checkGuide(ex: string, tree: GuideTree): boolean {
        if (!tree) { throw new UndefinedArgumentException("tree is undefined") }

        var inputExpression = ex.replace(" ", "");
        var splitExpressions = inputExpression.split("=");

        if (!tree.paths || tree.paths.length === 0) { return false }

        var rootCheck = this.checkNode(tree.rootNode, splitExpressions);
        if (rootCheck) {
            return true;
        }

        if (tree.activePath && tree.activePath >= 0 && this.traverseNodes(tree.paths[tree.activePath], splitExpressions, tree.activePath, tree)) {
            return true;
        } else {
            for (var i = 0; i < tree.paths.length; i++) {
                if (!tree.activePath || i != tree.activePath) {
                    var check = this.traverseNodes(tree.paths[i], splitExpressions, i, tree);
                    if (check) { return true }
                }
            }
        }
        return false;
    }

    private traverseNodes(node: GuideNode, splitExpressions: string[], currentPath: number, tree: GuideTree): boolean {
        if (!node) {
            return false;
        }

        var check = this.checkNode(node, splitExpressions);
        if (check) {
            tree.paths[currentPath] = node;
            return true;
        }

        if (!node.children) {
            return false;
        }

        for (let i = 0; i < node.children.length; i++) {
            let check = this.traverseNodes(node.children[i], splitExpressions, currentPath, tree);
            if (check) {
                return true
            }
        }
    }

    private checkNode(node: GuideNode, splitExpressions: string[]): boolean {
        var nodeExpression = node.expression.replace(" ", "");
        var splitNodeExpressions = nodeExpression.split("=");

        if (splitExpressions[0] === splitNodeExpressions[0] && !splitExpressions[1] && !splitNodeExpressions[1]) {
            return true;
        } else if (splitExpressions[0] === splitNodeExpressions[0] && splitExpressions[1] === splitNodeExpressions[1]) {
            return true;
        } else if (splitExpressions[0] === splitNodeExpressions[1] && splitExpressions[1] === splitNodeExpressions[0]) {
            return true;
        }

        return false;
    }
}