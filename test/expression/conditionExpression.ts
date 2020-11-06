import { expect } from 'chai';
import { path, value, hashKey, sortKey } from '../../src/expression/expression';
import { and, attributeExists, attributeNotExists, attributeType, beginsWith, between, contains, equals, greaterEquals, greaterThan, inList, lowerEquals, lowerThan, not, notEquals, or, size } from '../../src/expression/conditionExpression';
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

describe('#conditionExpression', function () {
    describe('#and', function () {
        it('should exist', function () {
            expect(and).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = and(
                equals(path('a'), value(1)),
                equals(path('b'), value(2)),
                equals(path('c'), value(3))
            );
            const result = expression.serialize(context);
            expect(result).equals('(#n0 = :v0 AND #n1 = :v1 AND #n2 = :v2)');
        });
        it('should throws an error if the expression is empty', function () {
            expect(() => and()).to.throws('LogicalExpression must contains at least one condition.');
        });
    });
    describe('#attributeExists', function () {
        it('should exist', function () {
            expect(attributeExists).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = attributeExists(path('a'));
            const result = expression.serialize(context);
            expect(result).equals('attribute_exists(#n0)');
        });
    });
    describe('#attributeNotExists', function () {
        it('should exist', function () {
            expect(attributeNotExists).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = attributeNotExists(path('a'));
            const result = expression.serialize(context);
            expect(result).equals('attribute_not_exists(#n0)');
        });
    });
    describe('#attributeType', function () {
        it('should exist', function () {
            expect(attributeType).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = attributeType(path('a'), value('S'));
            const result = expression.serialize(context);
            expect(result).equals('attribute_type(#n0, :v0)');
        });
    });
    describe('#beginsWith', function () {
        it('should exist', function () {
            expect(beginsWith).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = beginsWith(path('a'), value('v'));
            const result = expression.serialize(context);
            expect(result).equals('begins_with(#n0, :v0)');
        });
    });
    describe('#between', function () {
        it('should exist', function () {
            expect(between).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = between(path('a'), value(-1), value(1));
            const result = expression.serialize(context);
            expect(result).equals('#n0 BETWEEN :v0 AND :v1');
        });
    });
    describe('#contains', function () {
        it('should exist', function () {
            expect(contains).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = contains(path('a'), value('test'));
            const result = expression.serialize(context);
            expect(result).equals('contains(#n0, :v0)');
        });
    });
    describe('#equals', function () {
        it('should exist', function () {
            expect(equals).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = equals(path('a'), value('test'));
            const result = expression.serialize(context);
            expect(result).equals('#n0 = :v0');
        });
    });
    describe('#greaterEquals', function () {
        it('should exist', function () {
            expect(greaterEquals).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = greaterEquals(path('a'), value(4));
            const result = expression.serialize(context);
            expect(result).equals('#n0 >= :v0');
        });
    });
    describe('#greaterThan', function () {
        it('should exist', function () {
            expect(greaterThan).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = greaterThan(path('a'), value(4));
            const result = expression.serialize(context);
            expect(result).equals('#n0 > :v0');
        });
    });
    describe('#inList', function () {
        it('should exist', function () {
            expect(inList).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = inList(path('a'), [value('test1'), value('test2'), path('path1')]);
            const result = expression.serialize(context);
            expect(result).equals('#n0 IN (:v0, :v1, #n1)');
        });
    });
    describe('#lowerEquals', function () {
        it('should exist', function () {
            expect(lowerEquals).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = lowerEquals(path('a'), value(4));
            const result = expression.serialize(context);
            expect(result).equals('#n0 <= :v0');
        });
    });
    describe('#lowerThan', function () {
        it('should exist', function () {
            expect(lowerThan).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = lowerThan(path('a'), value(4));
            const result = expression.serialize(context);
            expect(result).equals('#n0 < :v0');
        });
    });
    describe('#notEquals', function () {
        it('should exist', function () {
            expect(notEquals).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = notEquals(path('a'), value(4));
            const result = expression.serialize(context);
            expect(result).equals('#n0 <> :v0');
        });
    });
    describe('#not', function () {
        it('should exist', function () {
            expect(not).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = not(equals(path('a'), value(4)));
            const result = expression.serialize(context);
            expect(result).equals('NOT (#n0 = :v0)');
        });
    });
    describe('#size', function () {
        it('should exist', function () {
            expect(size).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = size(path('a'));
            const result = expression.serialize(context);
            expect(result).equals('size(#n0)');
        });
    });
    describe('#or', function () {
        it('should exist', function () {
            expect(or).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = or(
                equals(path('a'), value(1)),
                equals(path('b'), value(2)),
                equals(path('c'), value(3))
            );
            const result = expression.serialize(context);
            expect(result).equals('(#n0 = :v0 OR #n1 = :v1 OR #n2 = :v2)');
        });
        it('should throws an error if the expression is empty', function () {
            expect(() => and()).to.throws('LogicalExpression must contains at least one condition.');
        });
    });
    describe('#composed condition expression', function () {
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = and(
                equals(hashKey(), path('b')),
                not(equals(sortKey(), value(1))),
                attributeExists(path('c', 0)),
                or(
                    between(path('c', 0), value(-100), value(-1)),
                    between(path('c', 0), value(1), value(100))
                )
            );
            const result = expression.serialize(context);
            expect(result).equals('(#n0 = #n1 AND NOT (#n2 = :v0) AND attribute_exists(#n3[:v1]) AND (#n3[:v1] BETWEEN :v2 AND :v3 OR #n3[:v1] BETWEEN :v0 AND :v4))');
        });
    });
});