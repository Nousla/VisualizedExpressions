import { Injectable } from '@angular/core';
import * as math from 'mathjs';

@Injectable()
export class ProblemSolvingService {

    checkExpression(ex: string, x: number, y: number): boolean {
        var expression = ex.split('=');
        var leftside = expression[0];
        var rightside = expression[1];
        var symbol: string;

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
        scopeCorrect[symbol] = x;
        scopeWrong[symbol] = y;

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