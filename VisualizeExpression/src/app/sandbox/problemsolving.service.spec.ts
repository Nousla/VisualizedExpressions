import { ProblemSolvingService } from './problemsolving.service';
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";

describe('ProblemSolvingService', () =>{
    let service: ProblemSolvingService;

    beforeEach(() => { service = new ProblemSolvingService(); });
    
    it('#problemSolving should throw error if an empty string, with an empty correct and wrong solution is provided', () => {
        var testEx = "";
        var testCorr = "";
        var testWrong = "";

        let problemSolvingFunction = () => {
            service.checkExpression(testEx, testCorr, testWrong);
        }

        expect(problemSolvingFunction).toThrowError(UndefinedArgumentException);
    });

    it('#problemSolving should succeed if expression is correct with x on left side, given correct solution', () => {
        var testEx= "4x+5=9";
        var testCorr = "1";
        var testWrong = "2";

        var checkedEx = service.checkExpression(testEx, testCorr, testWrong);

        expect(checkedEx).toBe(true);
    });

    it('#problemSolving should succeed if expression is correct with x on right side, given correct solution', () => {
        var testEx= "9=4x+5";
        var testCorr = "1";
        var testWrong = "2";

        var checkedEx = service.checkExpression(testEx, testCorr, testWrong);

        expect(checkedEx).toBe(true);
    });

    it('#problemSolving should succeed if expression is correct if other variable than x is used', () => {
        var testEx = "4g+5=9";
        var testCorr = "1";
        var testWrong = "2";

        var checkedEx = service.checkExpression(testEx, testCorr, testWrong);

        expect(checkedEx).toBe(true);
    });

    it('#problemSolving should succeed if expression is false when no variable is present', () => {
        var testEx = "4+5=9";
        var testCorr = "1";
        var testWrong = "2";

        var checkedEx = service.checkExpression(testEx, testCorr, testWrong);

        expect(checkedEx).toBe(false);
    });

    it('#problemSolving should succeed if expression is false when correct solution is wrong', () => {
        var testEx = "4+5=9";
        var testCorr = "87";
        var testWrong = "2";

        var checkedEx = service.checkExpression(testEx, testCorr, testWrong);

        expect(checkedEx).toBe(false);
    });

    it('#problemSolving should succeed if expression is false when wrong solution is wrong', () => {
        var testEx = "4+5=9";
        var testCorr = "1";
        var testWrong = "25";

        var checkedEx = service.checkExpression(testEx, testCorr, testWrong);

        expect(checkedEx).toBe(false);
    });

});