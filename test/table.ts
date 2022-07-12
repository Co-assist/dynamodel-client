import { expect } from 'chai';
import { Schemaless, Schema } from '../src/schema';
import { model } from '../src/model';
import { Table } from '../src/table';

function fakeModels() {
    const schema = new Schemaless({});
    return model(schema);
}

function fakeTable(modelConstructor = fakeModels()) {
    return new Table({
        name: 'fake',
        primaryKey: {
            hash: 'id'
        },
        indexes: {
            'INDEX': {
                hash: 'value'
            }
        },
        models: [modelConstructor]
    });
}

function fakeTableWithoutIndexes(modelConstructor = fakeModels()) {
    return new Table({
        name: 'fake',
        primaryKey: {
            hash: 'id'
        },
        models: [modelConstructor]
    });
}

describe('#table', function () {
    describe('#Table', function () {
        it('should exists', function () {
            expect(Table).to.be.a('function');
        });
        it('should be instanciable from a schema', function () {
            const table = fakeTable();
            expect(table).to.be.instanceOf(Table);
        });
        describe('#primaryKey', function () {
            it('should get the table primary key', function () {
                const table = fakeTable();
                const expected = {
                    hash: 'id'
                };
                expect(table.primaryKey).to.deep.equals(expected);
            });
        });
        describe('#primaryKeyNames', function () {
            it('should get the table primary key names', function () {
                const table = fakeTable();
                const expected = ['id'];
                expect(table.primaryKeyNames).to.deep.equals(expected);
                expect(table.primaryKeyNames).to.deep.equals(expected); // test lazy loading
            });
        });
        describe('#constructors', function () {
            it('should get the table constructors', function () {
                const Model = fakeModels();
                const table = fakeTable(Model);
                const expected = [Model];
                expect(table.constructors).to.deep.equals(expected);
            });
        });
        describe('#getName', function () {
            it('should get the table name without stage prefix', function () {
                const table = fakeTable();
                const expected = 'fake';
                expect(table.getName()).to.equals(expected);
            });
            it('should get the table name with stage prefix', function () {
                const table = fakeTable();
                const stage = 'dev';
                const expected = stage + '-fake';
                expect(table.getName(stage)).to.equals(expected);
            });
        });
        describe('#getIndex', function () {
            it('should get index by name', function () {
                const table = fakeTable();
                const expected = {
                    hash: 'value'
                };
                expect(table.getIndex('INDEX')).to.deep.equals(expected);
            });
            it('should throws error if the table has no index', function () {
                const table = fakeTableWithoutIndexes();
                expect(() => table.getIndex('INDEX')).to.throw(`Index 'INDEX' not found`);
            });
            it('should throws error if the index not exists', function () {
                const table = fakeTable();
                expect(() => table.getIndex('UNKNOWN')).to.throw(`Index 'UNKNOWN' not found`);
            });
        });
        describe('#getModelConstructor', function () {
            it('should found the associated model constructor', function () {
                const test1schema = new Schema({
                    type: {
                        test: (value) => value === 'test1'
                    }
                });
                const Test1Model = model(test1schema);
                const test2schema = new Schema({
                    type: {
                        test: (value) => value === 'test2'
                    }
                });
                const Test2Model = model(test2schema);
                const table = new Table({
                    name: 'fake',
                    primaryKey: {
                        hash: 'type'
                    },
                    models: [Test1Model, Test2Model]
                });
                expect(table.getModelConstructor({ type: 'test2' })).to.equals(Test2Model);
                expect(table.getModelConstructor(new Test2Model({ type: 'a' }))).to.equals(Test2Model);
            });
            it('should not found the associated model constructor', function () {
                const test1schema = new Schema({
                    type: {
                        test: (value) => value === 'test1'
                    }
                });
                const Test1Model = model(test1schema);
                const test2schema = new Schema({
                    type: {
                        test: (value) => value === 'test2'
                    }
                });
                const Test2Model = model(test2schema);
                const table = new Table({
                    name: 'fake',
                    primaryKey: {
                        hash: 'type'
                    },
                    models: [Test1Model]
                });
                expect(() => table.getModelConstructor({ type: 'test2' })).to.throws('No constructor found');
                expect(() => table.getModelConstructor(new Test2Model({ type: 'a' }))).to.throws(`'ModelImpl' is not supported`);
            });
            it('should not found the associated model constructor with modelKey', function () {
                const test1schema = new Schema({
                    type: {
                        test: (value) => typeof value === 'string'
                    },
                    dataType: {
                        test: (value) => value === 'otherDataType'
                    }
                });
                const Test1Model = model(test1schema);
                const test2schema = new Schema({
                    type: {
                        test: (value) => typeof value === 'string'
                    },
                    dataType: {
                        test: (value) => value === 'dataTypeTest'
                    }
                });
                const Test2Model = model(test2schema);
                const table = new Table({
                    name: 'fake',
                    primaryKey: {
                        hash: 'type'
                    },
                    models: [Test1Model, Test2Model],
                    modelKey: { path: 'dataType' }
                });
                expect(() => table.getModelConstructor({ type: 'a', dataType: 'error' })).to.throws('No constructor found');
                expect(table.getModelConstructor({ type: 'a', dataType: 'otherDataType' })).to.equals(Test1Model);
                expect(table.getModelConstructor({ type: 'a', dataType: 'dataTypeTest' })).to.equals(Test2Model);
            });
        });
    });
});