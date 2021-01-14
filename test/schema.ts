import { expect } from 'chai';
import { Schemaless, Schema, getSchema, getSafeSchema, ModelSchemaSymbol } from '../src/schema';

describe('#schema', function () {
    describe('#ModelSchemaSymbol', function () {
        it('should exists', function () {
            expect(ModelSchemaSymbol).to.be.a('symbol');
        });
        it('should throw an error', function () {
            expect(new Schema(null)).to.be.rejectedWith('Empty schema');
        });
    });
    describe('#Schemaless', function () {
        it('should exists', function () {
            expect(Schemaless).to.be.a('function');
        });
        describe('#getAttributeSchema', function () {
            it('should exists', function () {
                expect(Schemaless.prototype.getAttributeSchema).to.be.a('function');
            });
            it('should get attribute schema for every attribute name', function () {
                const schema = new Schemaless({});
                const attributeSchema = schema.getAttributeSchema('');
                expect(attributeSchema).to.be.a('object');
                expect(attributeSchema.test).to.be.a('function');
                expect(attributeSchema.test(1, ['path'], { path: 1 })).to.be.true;
            });
        });
        describe('#validate', function () {
            it('should exists', function () {
                expect(Schemaless.prototype.validate).to.be.a('function');
            });
            it('should validate every object', function () {
                const schema = new Schemaless({});
                expect(schema.validate({ a: 1, b: false })).to.be.undefined;
            });
        });
        describe('#validatePath', function () {
            it('should exists', function () {
                expect(Schemaless.prototype.validatePath).to.be.a('function');
            });
            it.only('should validate every path', function () {
                const schema = new Schemaless({});
                expect(schema.validatePath({ a: 1, b: false }, ['a'])).to.be.undefined;
            });
        });
        describe('#toJSON', function () {
            it('should exists', function () {
                expect(Schemaless.prototype.toJSON).to.be.a('function');
            });
            it('should jsonify every object properties', function () {
                const schema = new Schemaless({ a: { test: () => true }, e: { test: () => true } });
                const object = {
                    a: 2,
                    b: false,
                    c: {
                        ca: 'test',
                        b: false
                    }
                };
                const expected = { ...object };
                const json = schema.toJSON(object);
                expect(json).to.deep.equals(expected);
            });
        });
    });
    describe('#Schema', function () {
        it('should exists', function () {
            expect(Schema).to.be.a('function');
        });
        it('should not be empty', function () {
            // @ts-expect-error
            expect(() => new Schema()).to.throws('Empty schema');
        });
        it('should be instanciated', function () {
            expect(new Schema({ a: { test: () => true } })).to.be.ok;
        })
        describe('#getAttributeSchema', function () {
            it('should exists', function () {
                expect(Schema.prototype.getAttributeSchema).to.be.a('function');
            });
            it('should get attribute schema for defined attribute', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => true
                    }
                });
                const attributeSchema = schema.getAttributeSchema('a');
                expect(attributeSchema).to.be.a('object');
                expect(attributeSchema.test).to.be.a('function');
                expect(attributeSchema.test(1, ['path'], { path: 1 })).to.be.true;
            });
            it('should get undefined for undefined attribute', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => true
                    }
                });
                const attributeSchema = schema.getAttributeSchema('b');
                expect(attributeSchema).to.be.undefined;
            });
        });
        describe('#validate', function () {
            it('should exists', function () {
                expect(Schemaless.prototype.validate).to.be.a('function');
            });
            it('should validate item', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => Number.isInteger(value)
                    },
                    b: {
                        test: (value) => value == undefined || typeof value === 'boolean'
                    }
                });
                expect(schema.validate({ a: -1 })).to.be.undefined;
                expect(schema.validate({ a: 1, b: undefined })).to.be.undefined;
                expect(schema.validate({ a: 0, b: true })).to.be.undefined;
                expect(schema.validate({ a: 2, b: false })).to.be.undefined;
                expect(schema.validate({ a: 2, b: false, c: 'not checked' })).to.be.undefined;
            });
            it('should validate item', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => Number.isInteger(value)
                    },
                    b: {
                        test: (value) => value == undefined || typeof value === 'boolean'
                    }
                });
                expect(() => schema.validate({})).to.throws('Invalid value');
                expect(() => schema.validate({ a: undefined })).to.throws('Invalid value');
                expect(() => schema.validate({ a: 'test' })).to.throws('Invalid value');
                expect(() => schema.validate({ b: true })).to.throws('Invalid value');
                expect(() => schema.validate({ a: 2, b: 'false' })).to.throws('Invalid value');
            });
        });
        describe('#validatePath', function () {
            it('should exists', function () {
                expect(Schema.prototype.validatePath).to.be.a('function');
            });
            it('should validate path', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => Number.isInteger(value)
                    },
                    b: {
                        test: (value) => value == undefined || typeof value === 'boolean'
                    }
                });
                expect(schema.validatePath({ a: 1, b: true }, ['a'])).to.be.undefined;
                expect(schema.validatePath({ a: 1, b: true }, ['b'])).to.be.undefined;
            });
            it('should validate path', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => Number.isInteger(value)
                    },
                    b: {
                        test: (value) => value == undefined || typeof value === 'boolean'
                    }
                });
                expect(() => schema.validatePath({ a: '1', b: true }, ['a'])).to.throws('Invalid value');
                expect(() => schema.validatePath({ a: 1, b: true }, ['c'])).to.throws('Invalid value');
            });
        });
        describe('#toJSON', function () {
            it('should exists', function () {
                expect(Schema.prototype.toJSON).to.be.a('function');
            });
            it('should jsonify every object properties', function () {
                const schema = new Schema({
                    a: {
                        test: (value) => Number.isInteger(value)
                    },
                    b: {
                        test: (value) => value == undefined || typeof value === 'boolean'
                    }
                });
                const object = {
                    a: 1,
                    b: undefined,
                    c: {
                        ca: 'test'
                    }
                };
                const expected = {
                    a: 1
                };
                const json = schema.toJSON(object);
                expect(json).to.deep.equals(expected);
            });
        });
    });
    describe('#getSchema', function () {
        it('should exists', function () {
            expect(getSchema).to.be.a('function');
        });
        it('should get the schema from object', function () {
            const schema = new Schemaless({});
            const object = {
                [ModelSchemaSymbol]: schema
            };
            expect(getSchema(object)).to.equals(schema);
        });
        it('should get the schema from class', function () {
            const schema = new Schemaless({});
            class Model {
                get [ModelSchemaSymbol]() {
                    return schema;
                }
            };
            expect(getSchema(Model)).to.equals(schema);
        });
        it('should get undefined if no schema found', function () {
            expect(getSchema({})).to.be.undefined;
        }); 1
    });
    describe('#getSafeSchema', function () {
        it('should exists', function () {
            expect(getSafeSchema).to.be.a('function');
        });
        it('should get the schema', function () {
            const schema = new Schemaless({});
            const object = {
                [ModelSchemaSymbol]: schema
            };
            expect(getSafeSchema(object)).to.equals(schema);
        });
        it('should throws an error if no schema found', function () {
            expect(() => getSafeSchema({})).to.throws('No schema found for the given object');
        });
    });
});