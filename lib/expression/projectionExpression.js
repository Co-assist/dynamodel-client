"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeProjection = void 0;
const objectUtils_1 = require("../util/objectUtils");
const expression_1 = require("./expression");
function serializeProjection(projection, context) {
    if (!projection) {
        return undefined;
    }
    const finalProjection = objectUtils_1.distinct([...projection, ...context.table.primaryKeyNames.map((key) => expression_1.path(key))]);
    return finalProjection.map((path) => path.serialize(context)).join(', ');
}
exports.serializeProjection = serializeProjection;
