import { Injectable } from "@angular/core";
import { GuideTree, GuideNode } from "./guide-tree";

@Injectable()
export class GuideTreeService {
    public generateGuideTree(externalGuideTreeJSON: string): GuideTree {

        //var testTree = "{\"tree\":[{\"ex\":\"2+5=10-3\"},{\"tid\":\"0\",\"ex\":\"7=10-3\"},{\"tid\":\"0\",\"ex\":\"2+5=7\"},{\"tid\":\"1/2\",\"ex\":\"7=7\"}]}";

        // %7B%22tree%22%3A%5B%7B%22ex%22%3A%222%2B5%3D10-3%22%7D%2C%7B%22tid%22%3A%220%22%2C%22ex%22%3A%227%3D10-3%22%7D%2C%7B%22tid%22%3A%220%22%2C%22ex%22%3A%222%2B5%3D7%22%7D%2C%7B%22tid%22%3A%221%2F2%22%2C%22ex%22%3A%227%3D7%22%7D%5D%7D
        //var a = encodeURIComponent(testTree);
        //console.log(a);


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

        console.log(guideTree);

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