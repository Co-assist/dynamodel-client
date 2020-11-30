import { expect } from 'chai';
import * as AWS from 'aws-sdk';
import { sinonTest } from '../testUtils';
import { BatchPutRequest } from '../../src/request/batchPutRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import { DynamoModel } from '../../src';

describe('#batchPutRequest', function () {
    describe('#constructor', function () {
        it('should exists', function () {
            expect(BatchPutRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                items: []
            };
            const request = new BatchPutRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(BatchPutRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(BatchPutRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion', sinonTest(async function () {
            const params: DynamoModel.BatchPutInput = {
                table: fakeTable,
                items: [
                    {
                        id: 1,
                        type: 'a',
                        value: 1
                    },
                    new FakeAModel({ id: 2, value: 1 }),
                    new FakeBModel({ id: 3, value: 'test' })
                ],
                returnConsumedCapacity: 'TOTAL',
                returnItemCollectionMetrics: 'SIZE'
            };
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
                RequestItems: {
                    'dev-fake': [
                        {
                            PutRequest: {
                                Item: {
                                    id: 1,
                                    type: 'a',
                                    value: 1
                                }
                            }
                        },
                        {
                            PutRequest: {
                                Item: {
                                    id: 2,
                                    type: 'a',
                                    value: 1
                                }
                            }
                        },
                        {
                            PutRequest: {
                                Item: {
                                    id: 3,
                                    type: 'b',
                                    value: 'test'
                                }
                            }
                        }
                    ]
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE'
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'batchWrite').returns({
                promise: () => Promise.resolve({})
            });
            const request = new BatchPutRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should send multiple request for large amount of keys', sinonTest(async function () {
            const items = new Array(100);
            for (let i = 0; i < items.length; i++) {
                items[i] = {
                    id: i,
                    type: 'a',
                    value: 5
                }
            }
            const params = {
                table: fakeTable,
                items: items
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'batchWrite').returns({
                promise: () => Promise.resolve({})
            });
            const request = new BatchPutRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams.RequestItems['dev-fake']).have.lengthOf(25);
            expect(awsRequestStub.callCount).equals(4);
        }));
    });
});