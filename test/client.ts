import { expect } from 'chai';
import { Dynamodel } from '../src/client';
import { model } from '../src/model';
import { documentClient, sinonTest } from './testUtils';
import { BatchDeleteRequest } from '../src/request/batchDeleteRequest';
import { BatchGetRequest } from '../src/request/batchGetRequest';
import { BatchPutRequest } from '../src/request/batchPutRequest';
import { DeleteRequest } from '../src/request/deleteRequest';
import { GetRequest } from '../src/request/getRequest';
import { PutRequest } from '../src/request/putRequest';
import { QueryRequest } from '../src/request/queryRequest';
import { ScanRequest } from '../src/request/scanRequest';
import { UpdateRequest } from '../src/request/updateRequest';
import { Table } from '../src/table';
import { Schemaless } from '../src/schema';

class FakeModel extends model(new Schemaless({})) { }

const fakeTable = new Table({
    name: 'fake',
    models: [FakeModel],
    primaryKey: {
        hash: 'hashkey',
        sort: 'sortkey'
    }
});

describe('#dbClient', function () {
    describe('#constructor', function () {
        it('should exist', function () {
            expect(Dynamodel).to.be.a('function');
        });
        it('should be instanciable', function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            expect(dbClient).to.be.instanceOf(Dynamodel);
            // @ts-expect-error
            expect(dbClient.documentClient).to.equals(documentClient);
            // @ts-expect-error
            expect(dbClient.stage).to.equals('test');
        });
    });
    describe('#batchDelete', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.batchDelete).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(BatchDeleteRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                keys: []
            };
            expect(await dbClient.batchDelete(params)).equals(response);
        }));
    });
    describe('#batchGet', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.batchGet).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(BatchGetRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                keys: []
            };
            expect(await dbClient.batchGet(params)).equals(response);
        }));
    });
    describe('#batchPut', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.batchPut).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(BatchPutRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                items: []
            };
            expect(await dbClient.batchPut(params)).equals(response);
        }));
    });
    describe('#delete', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.delete).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(DeleteRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                key: {}
            };
            expect(await dbClient.delete(params)).equals(response);
        }));
    });
    describe('#get', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.get).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(GetRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                key: {}
            };
            expect(await dbClient.get(params)).equals(response);
        }));
    });
    describe('#put', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.put).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(PutRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                item: {}
            };
            expect(await dbClient.put(params)).equals(response);
        }));
    });
    describe('#query', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.query).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(QueryRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable
            };
            expect(await dbClient.query(params)).equals(response);
        }));
    });
    describe('#scan', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.scan).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(ScanRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable
            };
            expect(await dbClient.scan(params)).equals(response);
        }));
    });
    describe('#update', function () {
        it('should exist', function () {
            expect(Dynamodel.prototype.update).to.be.a('function');
        });
        it('should execute the request', sinonTest(async function () {
            const dbClient = new Dynamodel(documentClient, 'test');
            const response = { responses: [] };
            this.stub(UpdateRequest.prototype, 'execute').resolves(response);
            const params = {
                table: fakeTable,
                item: {}
            };
            expect(await dbClient.update(params)).equals(response);
        }));
    });
});