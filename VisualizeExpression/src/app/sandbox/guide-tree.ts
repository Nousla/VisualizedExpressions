export class GuideTree {
    rootNode: GuideNode;
    paths: GuideNode[];
    activePath: number;
}

export class GuideNode {
    expression: string;
    children: GuideNode[];
}