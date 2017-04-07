export class InternalNode {
    public name: string;
    public type: Type;
    public group: Group;
    public children: InternalNode[];
}

export const enum Type {
    Addition,
    Decimal,
    Equality,
    Integer,
    Subtraction
}

export const enum Group {
    Number,
    Operator
}