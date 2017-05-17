export class Exception extends Error {
    private _name: string;
    private _message: string;
    private _stack: string;

    constructor(name: string, message: string) {
        super();
        this._name = name;
        this._message = message;
        this._stack = (new Error()).stack;
    }

    get name(): string {
        return this._name;
    }

    get message(): string {
        return this._message;
    }

    get stack(): string {
        return this._stack;
    }
}

export default Exception;