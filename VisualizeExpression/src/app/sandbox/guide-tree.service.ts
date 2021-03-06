import { Injectable } from "@angular/core";
import { GuideTree, GuideNode } from "./guide-tree";

@Injectable()
export class GuideTreeService {
    public generateGuideTree(externalGuideTreeJSON: string): GuideTree {

        var externalGuideTree: ExternalGuideTree;
        try {
            externalGuideTree = JSON.parse(externalGuideTreeJSON);
        }
        catch (ex) {
            return null;
        }

        if (!externalGuideTree.tree) {
            return null;
        }

        var guideTree = new GuideTree();
        var guideNodes: GuideNode[] = [];
        for (var i = 0; i < externalGuideTree.tree.length; i++) {
            var guideNode = new GuideNode();
            guideNode.expression = externalGuideTree.tree[i].ex;
            guideNodes.push(guideNode);
        }

        for (var i = 0; i < guideNodes.length; i++) {
            var tid = externalGuideTree.tree[i].tid;
            
            if (!tid) {
                 guideTree.rootNode = guideNodes[i];
                continue;
            }

            var splitTid = tid.split("/");

            for (var j = 0; j < splitTid.length; j++) {
                var parentNode: GuideNode = guideNodes[splitTid[j]];

                if (!parentNode) {
                    continue;
                }

                if (!parentNode.children) {
                    parentNode.children = [];
                }

                parentNode.children.push(guideNodes[i]);
            }
        }

        guideTree.paths = [];
        if(guideTree.rootNode && guideTree.rootNode.children) {
            for(var i=0; i < guideTree.rootNode.children.length; i++) {
                guideTree.paths.push(guideTree.rootNode.children[i]);
            }
        }

        return guideTree;
    }
}

interface ExternalGuideTree {
    tree: ExternalGuideNode[];
}

interface ExternalGuideNode {
    ex: string;
    tid: string;
}