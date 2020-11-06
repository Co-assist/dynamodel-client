import { expect } from 'chai';
import { Schemaless, Schema } from '../src/schema';
import { model, isModel, toModel } from '../src/model';
import { Table } from '../src/table';

describe('#model', function () {
    describe('#model', function () {
        it('should exists', function () {
            expect(model).to.be.a('function');
        });
        it('should create a model constructor', function () {
            const schema = new Schemaless({});
            const Model = model(schema);
            expect(Model).to.be.a('function');
            expect(new Model({})).to.be.instanceOf(Model);
        });
        describe('#toJSON', function () {
            it('should exits', function () {
                const schema = new Schemaless({});
                const Model = model(schema);
                expect(Model.prototype.toJSON).to.be.a('function');
            });
            it('should jsonify a schemaless model', function () {
                const schema = new Schemaless({});
                const Model = model(schema);
                const object = { a: 1, b: 'test' };
                const instance = new Model(object);
                const json = instance.toJSON();
                const expected = { ...object };
                expect(json).deep.equals(expected);
            });
            it('should jsonify a Schema model', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => true
                    }
                });
                const Model = model(schema);
                const object = { a: 1, b: 'test' };
                const instance = new Model(object);
                const json = instance.toJSON();
                const expected = { a: 1 };
                expect(json).deep.equals(expected);
            });
        });
    });
    describe('#isModel', function () {
        it('should exists', function () {
            expect(isModel).to.be.a('function');
        });
        it('should be a model', function () {
            const schema = new Schemaless({});
            const Model = model(schema);
            const instance = new Model({});
            expect(isModel(instance)).to.be.true;
        });
        it('should not be a model', function () {
            const instance = new Object();
            expect(isModel(instance)).to.be.false;
        });

    });
    describe('#toModel', function () {
        it('should exists', function () {
            expect(toModel).to.be.a('function');
        });
        it('should transform an item to a model', function () {
            const schema = new Schema({
                id: {
                    test: (value) => typeof value === 'number'
                },
                type: {
                    test: (value) => value === 'user'
                },
                name: {
                    test: (value) => typeof value === 'string'
                }
            });
            const UserModel = model(schema);
            const table = new Table({
                name: 'fake',
                primaryKey: {
                    hash: 'id',
                    sort: 'type'
                },
                models: [UserModel]
            });
            const instance = toModel({ id: 1, type: 'user', name: 'Yoann Eichelberger' }, table);
            expect(instance).to.be.instanceOf(UserModel);
        });
        it('should transform an item to a model', function () {
            const schema = new Schema({
                id: {
                    test: (value) => typeof value === 'number'
                },
                type: {
                    test: (value) => value === 'user'
                },
                name: {
                    test: (value) => typeof value === 'string'
                }
            });
            const UserModel = model(schema);
            const table = new Table({
                name: 'fake',
                primaryKey: {
                    hash: 'id',
                    sort: 'type'
                },
                models: [UserModel]
            });
            expect(() => toModel({ id: 1, type: 'operator', name: 'Yoann Eichelberger' }, table)).to.throws('No constructor found');
        });
    });
});