import { expect } from 'chai';
import { path, value, hashKey, sortKey } from '../../src/expression/expression';
import { model } from '../../src/model';
import { Table } from '../../src/table';
import { Schemaless } from '../../src/schema';
import { AttributeExpressions } from '../../src/expression/attributeExpressions';

class FakeModel extends model(new Schemaless({})) { }

const fakeTable1 = new Table({
    name: 'fake1',
    models: [FakeModel],
    primaryKey: {
        hash: 'hashkey',
        sort: 'sortkey'
    },
    indexes: {
        'INDEX_1': {
            hash: 'indexHash1',
            sort: 'indexSort1'
        },
        'INDEX_2': {
            hash: 'indexHash2'
        }
    }
});

const fakeTable2 = new Table({
    name: 'fake2',
    models: [FakeModel],
    primaryKey: {
        hash: 'hashkey'
    }
});

function fakeExpressionContext(indexName = undefined, table = fakeTable1) {
    return {
        attributes: new AttributeExpressions(),
        table,
        indexName
    };
}

describe('#expression', function () {
    describe('#path', function () {
        it('should exists', function () {
            expect(path).to.be.a('function');
        });
        it('should build an attribute expression', function () {
            const context = fakeExpressionContext();
            const expression = path('name');
            const result = expression.serialize(context);
            expect(result).equals('#n0');
            expect(context.attributes.names['#n0']).equals('name');
        });
        it('should build a path expression', function () {
            const context = fakeExpressionContext();
            const expression = path('name', 'subnames', 1, 'name');
            const result = expression.serialize(context);
            expect(result).equals('#n0.#n1[:v0].#n0');
            expect(context.attributes.names['#n0']).equals('name');
            expect(context.attributes.names['#n1']).equals('subnames');
            expect(context.attributes.values[':v0']).equals(1);
        });
        it('should use the same instance for the same path', function () {
            const expression1 = path('name');
            const expression2 = path('name');
            expect(expression1).equals(expression2);
            const expression3 = path('name', 0, 'subname');
            const expression4 = path('name', 0, 'subname');
            expect(expression3).equals(expression4);
        });
        it('should throws an error if the path is empty', function () {
            // @ts-expect-error
            expect(() => path()).to.throws('Path must start with an attribute name');
        });
        it('should throws an error if the path start with a number', function () {
            // @ts-expect-error
            expect(() => path(1, 'subname')).to.throws('Path must start with an attribute name: \'1,subname\'');
        });
        it('should throws an error if the path contains a invalid type', function () {
            const context = fakeExpressionContext();
            // @ts-expect-error
            const expression = path('name', true);
            expect(() => expression.serialize(context)).to.throws('Illegal path attribute type: \'boolean\'');
        });
    });
    describe('#value', function () {
        it('should exists', function () {
            expect(value).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = value(123);
            const result = expression.serialize(context);
            expect(result).equals(':v0');
            expect(context.attributes.values[':v0']).equals(123);
        });
    });
    describe('#hashKey', function () {
        it('should exists', function () {
            expect(hashKey).to.be.a('function');
        });
        it('should build the expression from primary key', function () {
            const context = fakeExpressionContext();
            const expression = hashKey();
            const result = expression.serialize(context);
            expect(result).equals('#n0');
            expect(context.attributes.names['#n0']).equals('hashkey');
        });
        it('should build the expression from index', function () {
            const context = fakeExpressionContext('INDEX_1');
            const expression = hashKey();
            const result = expression.serialize(context);
            expect(result).equals('#n0');
            expect(context.attributes.names['#n0']).equals('indexHash1');
        });
        it('should throws an error if the index is not found', function () {
            const context = fakeExpressionContext('INDEX_UNKNOWN');
            const expression = hashKey();
            expect(() => expression.serialize(context)).to.throws('Index \'INDEX_UNKNOWN\' not found in the table \'fake1\'');
        });
    });
    describe('#sortKey', function () {
        it('should exists', function () {
            expect(sortKey).to.be.a('function');
        });
        it('should build the expression from primary key', function () {
            const context = fakeExpressionContext();
            const expression = sortKey();
            const result = expression.serialize(context);
            expect(result).equals('#n0');
            expect(context.attributes.names['#n0']).equals('sortkey');
        });
        it('should build the expression from index', function () {
            const context = fakeExpressionContext('INDEX_1');
            const expression = sortKey();
            const result = expression.serialize(context);
            expect(result).equals('#n0');
            expect(context.attributes.names['#n0']).equals('indexSort1');
        });
        it('should throws an error if the index is not found', function () {
            const context = fakeExpressionContext('INDEX_UNKNOWN');
            const expression = sortKey();
            expect(() => expression.serialize(context)).to.throws('Index \'INDEX_UNKNOWN\' not found in the table \'fake1\'');
        });
        it('should throws an error if the index has no sort key', function () {
            const context = fakeExpressionContext('INDEX_2');
            const expression = sortKey();
            expect(() => expression.serialize(context)).to.throws('No sort key found for the index \'INDEX_2\' of the table \'fake1\'');
        });
        it('should throws an error if the index (primary key) has no sort key', function () {
            const context = fakeExpressionContext(undefined, fakeTable2);
            const expression = sortKey(); 1
            expect(() => expression.serialize(context)).to.throws('No sort key found for the primary key of the table \'fake2\'');
        });
    });
});