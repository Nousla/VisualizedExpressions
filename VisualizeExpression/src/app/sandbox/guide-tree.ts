
export class GuideTree {
    rootNode: GuideNode;
    path: GuideNode[];
    activePath: number;
    activeNode: GuideNode;
}

export class GuideNode {
    expression: string;
    children: GuideNode[];
}