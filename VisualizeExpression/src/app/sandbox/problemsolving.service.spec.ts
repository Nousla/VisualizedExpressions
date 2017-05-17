import { ProblemSolvingService } from './problemsolving.service';
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";

describe('ProblemSolvingService', () =>{
    let service: ProblemSolvingService;

    beforeEach(() => { service = new ProblemSolvingService(); });

    it('#problemSolving an empty string, with  an empty correct and wrong solution', () => {
        var testEx = "";
        var testCorr = "";
        var testWrong = "";

        let problemSolvingFunction = () => {
            service.checkExpression(testEx, testCorr, testWrong);
        }

        expect(problemSolvingFunction).toThrowError(UndefinedArgumentException);
    });
});