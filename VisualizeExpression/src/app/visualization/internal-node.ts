export class InternalNode {
    public name: string;
    public type: Type;
    public group: Group;
    public parent: InternalNode;
    public children: InternalNode[];
}

export const enum Type {
    Addition,
    Decimal,
    Equality,
    Integer,
    Parentheses,
    Subtraction
}

export const enum Group {
    Number,
    Operator,
    Container
}