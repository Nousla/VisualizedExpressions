export class InternalNode {
    public text: string;
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
    Subtraction,
    Unknown
}

export const enum Group {
    Number,
    Operator,
    Container,
    Unknown
}