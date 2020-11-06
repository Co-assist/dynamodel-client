import { expect } from 'chai';
import { pickKeys, omitKeys, distinct, splitArray, flatArray, setToArray, mapToArray, sum, isDefine } from '../../src/util/objectUtils';

describe('#objectUtils', function () {
    describe('#pickKeys', function () {
        it('should exists', function () {
            expect(pickKeys).to.be.a('function');
        });
        it('should pick keys', function () {
            const object = {
                a: 1,
                b: 2,
                c: 3
            };
            const keys: (keyof typeof object)[] = [
                'a', 
                'b',
                // @ts-expect-error 
                'd'
            ];
            const expected = {
                a: 1,
                b: 2
            };
            const result = pickKeys(object, keys);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#omitKeys', function () {
        it('should exists', function () {
            expect(omitKeys).to.be.a('function');
        });
        it('should omit keys', function () {
            const object = {
                a: 1,
                b: 2,
                c: 3
            };
            const keys: (keyof typeof object)[] = [
                'a', 
                'b',
                // @ts-expect-error 
                'd'
            ];
            const expected = {
                c: 3
            };
            const result = omitKeys(object, keys);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#distinct', function () {
        it('should exists', function () {
            expect(distinct).to.be.a('function');
        });
        it('should distinct', function () {
            const array = [1, 2, 1, 'a', 'a', 'b', 'c', 2];
            const expected = [1, 2, 'a', 'b', 'c'];
            const result = distinct(array);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#splitArray', function () {
        it('should exists', function () {
            expect(splitArray).to.be.a('function');
        });
        it('should split array', function () {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
            const result = splitArray(array, 3);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#flatArray', function () {
        it('should exists', function () {
            expect(flatArray).to.be.a('function');
        });
        it('should flat array', function () {
            const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
            const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result = flatArray(array);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#setToArray', function () {
        it('should exists', function () {
            expect(setToArray).to.be.a('function');
        });
        it('should transform set to array', function () {
            const expected = [1, 2, 3];
            const set = new Set(expected);
            const result = setToArray(set);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#mapToArray', function () {
        it('should exists', function () {
            expect(mapToArray).to.be.a('function');
        });
        it('should transform set to array', function () {
            const expected = [[1, 'a'], [2, 'b'], [3, 'c']] as const;
            const map = new Map<number, string>(expected);
            const result = mapToArray(map);
            expect(result).to.deep.equals(expected);
        });
    });
    describe('#sum', function () {
        it('should exists', function () {
            expect(sum).to.be.a('function');
        });
        it('should sum values', function () {
            const array = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
            const expected = 55;
            const result = sum(array);
            expect(result).to.equals(expected);
        });
    });
    describe('#isDefine', function () {
        it('should exists', function () {
            expect(isDefine).to.be.a('function');
        });
        it('should be define', function () {
            expect(isDefine(0)).to.be.true;
            expect(isDefine('')).to.be.true;
            expect(isDefine([])).to.be.true;
            expect(isDefine({})).to.be.true;
            expect(isDefine(false)).to.be.true;
            expect(isDefine(true)).to.be.true;
            expect(isDefine({ a: undefined })).to.be.true;
        });
        it('should be undefined', function () {
            expect(isDefine(null)).to.be.false;
            expect(isDefine(undefined)).to.be.false;
        });
    });
});