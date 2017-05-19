import { Injectable } from '@angular/core';
import * as math from 'mathjs';
import { UndefinedArgumentException } from "../exceptions/undefined-argument-exception";

@Injectable()
export class ProblemSolvingService {

    checkExpression(ex: string, correct: string, wrong: string): boolean {
        var expression = ex.split('=');
        var leftside = expression[0];
        var rightside = expression[1];
        var symbol: string;

        if(!correct) {
            throw new UndefinedArgumentException("correct");
        }
        if(!wrong) {
            throw new UndefinedArgumentException("wrong");
        }
        correct = math.eval(correct);
        wrong = math.eval(wrong);

        try {
            var node = math.parse(ex.replace('=', '=='));
            node.traverse(function (node, path, parent) {
                if (node.isSymbolNode) {
                    if (symbol && symbol !== node.name) {
                        symbol = undefined;
                        return;
                    }
                    else {
                        symbol = node.name;
                    }
                }
            });
        }
        catch (ex) {
            return false;
        }

        if (!symbol) {
            return false;
        }

        var scopeCorrect = {};
        var scopeWrong = {};
            scopeCorrect[symbol] = correct;
            scopeWrong[symbol] = wrong;

        try {
            var nodeL = math.parse(leftside);
            var evalL = nodeL.compile().eval(scopeCorrect);
            var evalLW = nodeL.compile().eval(scopeWrong);
            var nodeR = math.parse(rightside);
            var evalR = nodeR.compile().eval(scopeCorrect);
            var evalRW = nodeR.compile().eval(scopeWrong);
        }
        catch (ex) {
            return false;
        }

        if (evalL == evalR) {
            if (evalLW != evalR) {
                return true
            }
            else if (evalRW != evalL) {
                return true
            }
        }
        return false
    }
}