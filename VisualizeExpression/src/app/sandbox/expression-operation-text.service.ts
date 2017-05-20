import { Injectable } from "@angular/core";

@Injectable()
export class ExpressionOperationTextService {
    private readonly TEXT_VISUALIZE_EXPRESSION: string = "Visualize an expression to add operations";
    private readonly TEXT_SELECT_NODE = "Select a node in the visualization to add an operation";
    private readonly TEXT_REPLACEMENT_OPERATION = "Replacement operation added to node. "
    + "Input the replacement expression and click apply, or click cancel to remove the operation";
    private readonly TEXT_UNEXPECTED_PROBLEM = "An unexpected problem has occurred";

    public getVisualizeExpressionText(): string {
        return this.TEXT_VISUALIZE_EXPRESSION;
    }

    public getSelectNodeText(): string {
        return this.TEXT_SELECT_NODE;
    }

    public getReplacementOperationText(): string {
        return this.TEXT_REPLACEMENT_OPERATION;
    }

    public getUnexpectedProblemText(): string {
        return this.TEXT_UNEXPECTED_PROBLEM;
    }
}

export default ExpressionOperationTextService;