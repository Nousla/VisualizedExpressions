"use strict";
var InternalData = (function () {
    function InternalData(data) {
        this._data = data;
    }
    Object.defineProperty(InternalData.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return InternalData;
}());
exports.InternalData = InternalData;
//# sourceMappingURL=internal-data.js.map