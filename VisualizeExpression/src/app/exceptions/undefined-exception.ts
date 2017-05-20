import { Exception } from "./exception";

export class UndefinedException extends Exception {
    constructor(referenceName: string) {
        super("Undefined Exception", referenceName + " is undefined!");
    }
}

export default UndefinedException;