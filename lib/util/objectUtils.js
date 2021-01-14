"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefine = exports.sum = exports.mapToArray = exports.setToArray = exports.flatArray = exports.splitArray = exports.distinct = exports.omitKeys = exports.pickKeys = void 0;
function pickKeys(item, keys) {
    return keys.reduce((newItem, key) => {
        if (key in item) {
            newItem[key] = item[key];
        }
        return newItem;
    }, {});
}
exports.pickKeys = pickKeys;
function omitKeys(item, keys) {
    return pickKeys(item, Object.keys(item).filter((key) => !keys.includes(key)));
}
exports.omitKeys = omitKeys;
function distinct(array) {
    return array.filter((elem, index) => array.indexOf(elem) === index);
}
exports.distinct = distinct;
function splitArray(array, length) {
    const arrayList = [];
    let i = 0;
    while (i < array.length) {
        arrayList.push(array.slice(i, (i += length)));
    }
    return arrayList;
}
exports.splitArray = splitArray;
function flatArray(arrayList) {
    return arrayList.reduce((flattedArray, array) => flattedArray.concat(array), []);
}
exports.flatArray = flatArray;
function setToArray(set) {
    const array = [];
    set.forEach((value) => array.push(value));
    return array;
}
exports.setToArray = setToArray;
function mapToArray(map) {
    const array = [];
    map.forEach((value, key) => array.push([key, value]));
    return array;
}
exports.mapToArray = mapToArray;
function sum(numbers) {
    return numbers.reduce((sum, nb) => sum + nb, 0);
}
exports.sum = sum;
function isDefine(value) {
    return value != null;
}
exports.isDefine = isDefine;
//# sourceMappingURL=objectUtils.js.map