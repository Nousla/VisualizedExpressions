export class InternalData {
    private _data: Array<any>;

    constructor(data: Array<any>) {
        this._data = data;
    }

    get data (): Array<any> {
        return this._data;
    }
}