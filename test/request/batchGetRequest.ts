import { expect } from 'chai';
import * as AWS from 'aws-sdk';
import { sinonTest } from '../testUtils';
import { BatchGetRequest } from '../../src/request/batchGetRequest'
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import { path } from '../../src/expression/expression';
import * as DynamoModel from '../../src';

describe('#batchGetRequest', function () {
    describe('#constructor', function () {
        it('should exists', function () {
            expect(BatchGetRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                keys: []
            };
            const request = new BatchGetRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(BatchGetRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(BatchGetRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion', sinonTest(async function () {
            const params: DynamoModel.BatchGetInput = {
                table: fakeTable,
                consistentRead: true,
                keys: [
                    {
                        id: 1,
                        type: 'a'
                    },
                    new FakeAModel({ id: 2 }),
                    new FakeBModel({ id: 3 })
                ],
                projection: [path('value')],
                returnConsumedCapacity: 'TOTAL'
            };
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.BatchGetItemInput = {
                RequestItems: {
                    'dev-fake': {
                        ConsistentRead: true,
                        ExpressionAttributeNames: {
                            '#n0': 'value',
                            '#n1': 'id',
                            '#n2': 'type'
                        },
                        Keys: [
                            {
                                id: 1,
                                type: 'a'
                            },
                            {
                                id: 2,
                                type: 'a'
                            },
                            {
                                id: 3,
                                type: 'b'
                            }
                        ],
                        ProjectionExpression: '#n0, #n1, #n2'
                    }
                },
                ReturnConsumedCapacity: 'TOTAL'
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'batchGet').returns({
                promise: () => Promise.resolve({})
            });
            const request = new BatchGetRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should send multiple request for large amount of keys', sinonTest(async function () {
            const keys = new Array(100);
            for (let i = 0; i < keys.length; i++) {
                keys[i] = {
                    id: i,
                    type: 'a',
                    value: 5
                }
            }
            const params = {
                table: fakeTable,
                keys: keys
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'batchGet').returns({
                promise: () => Promise.resolve({ Responses: { "dev-fake": [{ id: 1, type: 'b' }] } })
            });
            const request = new BatchGetRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams.RequestItems['dev-fake'].Keys).have.lengthOf(25);
            expect(awsRequestStub.callCount).equals(4);
        }));
    });
});