import * as math from 'mathjs'


export class MathParsingService {
    
    parseExpression(input: string) {
        var node = math.parse(input);
        
        node.traverse(function (node: mathjs.MathNode, path: string, parent: mathjs.MathNode) {

        }
    }
}