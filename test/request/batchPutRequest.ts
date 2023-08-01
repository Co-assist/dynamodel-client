import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { BatchPutRequest } from '../../src/request/batchPutRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import * as Dynamodel from '../../src';
import { BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

describe('#batchPutRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
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
            const params: Dynamodel.BatchPutInput = {
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
            const expectedAwsParams = {
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
            dynamoDBMock.on(BatchWriteItemCommand).resolves({});
            const awsRequestStub = dynamoDBMock.send;
            const request = new BatchPutRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
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
            dynamoDBMock.on(BatchWriteItemCommand).resolves({});
            const awsRequestStub = dynamoDBMock.send;
            const request = new BatchPutRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams['RequestItems']['dev-fake']).have.lengthOf(25);
            expect(awsRequestStub.callCount).equals(4);
        }));
    });
});