import { expect } from 'chai';
import { path, value } from '../../src/expression/expression';
import { ifNotExists, listAppend, addition, substraction, Updatable } from '../../src/expression/updateExpression';
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

describe('#updateExpression', function () {
    describe('#ifNotExists', function () {
        it('should exist', function () {
            expect(ifNotExists).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = ifNotExists(path('a'), value(0));
            const result = expression.serialize(context);
            expect(result).equals('if_not_exists(#n0, :v0)');
        });
    });
    describe('#listAppend', function () {
        it('should exist', function () {
            expect(listAppend).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = listAppend(path('a'), value(new Set(['b', 'c', 'd', 'e'])));
            const result = expression.serialize(context);
            expect(result).equals('list_append(#n0, :v0)');
        });
    });
    describe('#addition', function () {
        it('should exist', function () {
            expect(addition).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = addition(path('a'), value(1));
            const result = expression.serialize(context);
            expect(result).equals('#n0 + :v0');
        });
    });
    describe('#substraction', function () {
        it('should exist', function () {
            expect(substraction).to.be.a('function');
        });
        it('should build the expression', function () {
            const context = fakeExpressionContext();
            const expression = substraction(path('a'), value(1));
            const result = expression.serialize(context);
            expect(result).equals('#n0 - :v0');
        });
    });
    describe('#updatable', function () {
        describe('#constructor', function () {
            it('should exists', function () {
                expect(Updatable).to.be.a('function');
            });
        });
        it('should be instanciable', function () {
            const updatable = new Updatable();
            expect(updatable).to.be.instanceOf(Updatable);
        });
    });
    describe('#add', function () {
        it('should exists', function () {
            expect(Updatable.prototype.add).to.be.a('function');
        });
        it('should add expression', function () {
            const context = fakeExpressionContext();
            const expression = new Updatable();
            expression.add(path('a'), value(15));
            expression.add(path('b'), value(['n1', 'n2']));
            const result = expression.serialize(context);
            expect(result).equals('ADD #n0 :v0, #n1 :v1');
        });
    });
    describe('#delete', function () {
        it('should exists', function () {
            expect(Updatable.prototype.delete).to.be.a('function');
        });
        it('should delete expression', function () {
            const context = fakeExpressionContext();
            const expression = new Updatable();
            expression.delete(path('a'), value(new Set([1])));
            expression.delete(path('b'), value(new Set(['n1', 'n2'])));
            const result = expression.serialize(context);
            expect(result).equals('DELETE #n0 :v0, #n1 :v1');
        });
    });
    describe('#remove', function () {
        it('should exists', function () {
            expect(Updatable.prototype.remove).to.be.a('function');
        });
        it('should delete expression', function () {
            const context = fakeExpressionContext();
            const expression = new Updatable();
            expression.remove(path('a'));
            expression.remove(path('b'));
            const result = expression.serialize(context);
            expect(result).equals('REMOVE #n0, #n1');
        });
    });
    describe('#set', function () {
        it('should exists', function () {
            expect(Updatable.prototype.set).to.be.a('function');
        });
        it('should delete expression', function () {
            const context = fakeExpressionContext();
            const expression = new Updatable();
            expression.set(path('a'), addition(
                ifNotExists(path('a'), value(0)),
                value(5)
            ));
            expression.set(path('b', 'c'), listAppend(
                path('d'),
                value([1])
            ));
            const result = expression.serialize(context);
            expect(result).equals('SET #n0 = if_not_exists(#n0, :v0) + :v1, #n1.#n2 = list_append(#n3, :v2)');
        });
    });
    describe('#serialize', function () {
        it('should exists', function () {
            expect(Updatable.prototype.serialize).to.be.a('function');
        });
    });
});