import { expect } from 'chai';
import { path } from '../../src/expression/expression';
import { serializeProjection } from '../../src/expression/projectionExpression';
import { model } from '../../src/model';
import { Table } from '../../src/table';
import { Schemaless } from '../../src/schema';
import { AttributeExpressions } from '../../src/expression/attributeExpressions';

class FakeModel extends model(new Schemaless({})) { }

const fakeTable = new Table({
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

function fakeExpressionContext(indexName = undefined) {
    return {
        attributes: new AttributeExpressions(),
        table: fakeTable,
        indexName
    };
}

describe('#projectionExpression', function () {
    describe('#serializeProjection', function () {
        it('should exist', function () {
            expect(serializeProjection).to.be.a('function');
        });
        it('should returns undefined if no projection is given', function () {
            const context = fakeExpressionContext();
            const result = serializeProjection(undefined, context);
            expect(result).equals(undefined);
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const result = serializeProjection([path('a'), path('b', 1)], context);
            expect(result).equals('#n0, #n1[:v0], #n2, #n3');
        });
    });
});