import {Injectable} from '@angular/core';
import * as math from 'mathjs';

@Injectable()
export class ProblemSolvingService {

    checkExpression(ex: string, x: number, y: number): boolean{
        var expression = ex.split('=');
        var leftside = expression[0];
        var rightside = expression[1];

        var nodeL = math.parse(leftside);
        var evalL = nodeL.compile().eval({x});
        var evalW = nodeL.compile().eval({x: y});
        var nodeR = math.parse(rightside);
        var evalR = nodeR.compile().eval();

       if(evalL == evalR)
        {
            if(evalW =! evalR)
            {
                return true
            }
        }

        return false

    }
}