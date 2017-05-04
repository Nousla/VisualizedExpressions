import { Injectable } from "@angular/core";

@Injectable()
export class SandboxTextService {
    private readonly TEXT_STANDARD_DESCRIPTION: string = "The standard sandbox mode allows you to visualize any expression at your own leisure.";
    private readonly TEXT_STANDARD_EMPTY = "An empty expression has already been added to get you started. Try typing '1+2=3' in the input " +
    "field of the expression to visualize the expression.";
    private readonly TEXT_PROBLEM_SOLVING_DESCRIPTION = "The problem solving mode allows you to solve problems through visualized expressions.";
    private readonly TEXT_GUIDE_DESCRIPTION = "The guide mode allows you to follow the trail of predefined expressions through visualisations.";
    private readonly TEXT_INITIAL_EXPRESSION = "The initial expression of the problem has been inserted as the first expression to get you " +
    "started. Input new expressions to solve the problem step by step as you see fit.";
    private readonly TEXT_HINT_OPERATIONS = "Hint: Operations help you break down expressions into more manageable pieces.";
    private readonly TEXT_MODE_STANDARD = "Standard Mode";
    private readonly TEXT_MODE_PROBLEM_SOLVING = "Problem Solving Mode";
    private readonly TEXT_MODE_GUIDE = "Guide Mode";
    private readonly TEXT_MODE_NOT_FOUND = "Mode not found";

    public getStandardDescriptionText(): string {
        return this.TEXT_STANDARD_DESCRIPTION;
    }

    public getStandardEmptyText(): string {
        return this.TEXT_STANDARD_EMPTY;
    }

    public getProblemSolvingDescriptionText(): string {
        return this.TEXT_PROBLEM_SOLVING_DESCRIPTION;
    }

    public getGuideDescriptionText(): string {
        return this.TEXT_GUIDE_DESCRIPTION;
    }

    public getInitialExpressionText(): string {
        return this.TEXT_INITIAL_EXPRESSION;
    }

    public getOperationsHintText(): string {
        return this.TEXT_HINT_OPERATIONS;
    }

    public getModeNotFoundText(): string {
        return this.TEXT_MODE_NOT_FOUND;
    }

    public getModeStandardText(): string {
        return this.TEXT_MODE_STANDARD;
    }

    public getModeProblemSolvingText(): string {
        return this.TEXT_MODE_PROBLEM_SOLVING;
    }

    public getModeGuideText(): string {
        return this.TEXT_MODE_GUIDE;
    }
}

export default SandboxTextService;