import { GuideProgressService } from './guideprogress.service';
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";
import { GuideTree, GuideNode } from "./guide-tree";
import { UndefinedException } from "../exceptions/undefined-exception";

describe('GuideProgressService', () => {
    let guideService: GuideProgressService;

    beforeEach(() => {guideService = new GuideProgressService(); });

    it('#guideProgess should succeed if the tree is empty', () => {
        var tree = new GuideTree();
        var testEx = "4x+5=9";

        var checkedGuide = guideService.checkGuide(testEx, tree);

        expect(checkedGuide).toBe(false);
    });

    it('#guideProgress should throw an exception if expression is empty', () => {
        var tree = new GuideTree();
        var guideRootNode = new GuideNode();
        var guide1lvlleftNode = new GuideNode();
        var guide1lvlrightNode = new GuideNode();
        var guide2lvlleftNode = new GuideNode();
        tree.rootNode = guideRootNode;
        tree.activePath = -1;
        tree.paths = [guide1lvlleftNode, guide1lvlrightNode];
        guideRootNode.expression = "4x=9-5";
        guideRootNode.children = [guide1lvlleftNode, guide1lvlrightNode];
        guide1lvlleftNode.expression = "x=(9-5)/4";
        guide1lvlrightNode.expression ="4x=4";
        var testEx: "";

        let guideProgressFunction = () => {
            guideService.checkGuide(testEx, tree);
        }
        expect(guideProgressFunction).toThrowError(UndefinedArgumentException);

    });

    it('#guideProgress should succeed if tree contains the expression', () => {
        var tree = new GuideTree();
        var guideRootNode = new GuideNode();
        var guide1lvlleftNode = new GuideNode();
        var guide1lvlrightNode = new GuideNode();
        var guide2lvlleftNode = new GuideNode();
        tree.rootNode = guideRootNode;
        tree.activePath = -1;
        tree.paths = [guide1lvlleftNode, guide1lvlrightNode];
        guideRootNode.expression = "4x=9-5";
        guideRootNode.children = [guide1lvlleftNode, guide1lvlrightNode];
        guide1lvlleftNode.expression = "x=(9-5)/4";
        guide1lvlrightNode.expression ="4x=4";
        var testEx = "x=(9-5)/4";

        var checkedGuide = guideService.checkGuide(testEx, tree);

        expect(checkedGuide).toBe(true);
        
    });

    it('#guideProgress should succeed if the tree does not contain the expression', () => {
        var tree = new GuideTree();
        var guideRootNode = new GuideNode();
        var guide1lvlleftNode = new GuideNode();
        var guide1lvlrightNode = new GuideNode();
        var guide2lvlleftNode = new GuideNode();
        tree.rootNode = guideRootNode;
        tree.activePath = -1;
        tree.paths = [guide1lvlleftNode, guide1lvlrightNode];
        guideRootNode.expression = "4x=9-5";
        guideRootNode.children = [guide1lvlleftNode, guide1lvlrightNode];
        guide1lvlleftNode.expression = "x=(9-5)/4";
        guide1lvlrightNode.expression ="4x=4";
        var testEx = "17x=9-55";

        var checkedGuide = guideService.checkGuide(testEx, tree);

        expect(checkedGuide).toBe(false);
    });

    it('#guideProgress should throw execpetion if a node in the tree is missing an expression', () => {
        var tree = new GuideTree();
        var guideRootNode = new GuideNode();
        var guide1lvlleftNode = new GuideNode();
        var guide1lvlrightNode = new GuideNode();
        var guide2lvlleftNode = new GuideNode();
        tree.rootNode = guideRootNode;
        tree.activePath = -1;
        tree.paths = [guide1lvlleftNode, guide1lvlrightNode];
        guideRootNode.expression = "4x=9-5";
        guideRootNode.children = [guide1lvlleftNode, guide1lvlrightNode];
        guide1lvlleftNode.expression = "x=(9-5)/4";
        var testEx = "17x=9-55";

        let guideProgressFunction = () => {
            guideService.checkGuide(testEx, tree);
        }
        expect(guideProgressFunction).toThrowError(UndefinedException);
    });
});