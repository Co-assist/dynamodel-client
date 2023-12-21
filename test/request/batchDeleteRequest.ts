import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { BatchDeleteRequest } from '../../src/request/batchDeleteRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import * as Dynamodel from '../../src';
import { BatchWriteCommand, BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb';

describe('#batchDeleteRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
    describe('#constructor', function () {
        it('should exists', function () {
            expect(BatchDeleteRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                keys: []
            };
            const request = new BatchDeleteRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(BatchDeleteRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(BatchDeleteRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion', sinonTest(async function () {
            const params: Dynamodel.BatchDeleteInput = {
                table: fakeTable,
                keys: [
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
            const expectedAwsParams: BatchWriteCommandInput = {
                RequestItems: {
                    'dev-fake': [
                        {
                            DeleteRequest: {
                                Key: {
                                    id: 1,
                                    type: 'a'
                                }
                            }
                        },
                        {
                            DeleteRequest: {
                                Key: {
                                    id: 2,
                                    type: 'a'
                                }
                            }
                        },
                        {
                            DeleteRequest: {
                                Key: {
                                    id: 3,
                                    type: 'b'
                                }
                            }
                        }
                    ]
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE'
            };
            dynamoDBMock.on(BatchWriteCommand).resolves({})
            const request = new BatchDeleteRequest(documentClient, params, 'dev');
            await request.execute();
            const dynamodDBSendStub = dynamoDBMock.send;
            const awsParams = dynamodDBSendStub.args[0][0];
            expect(awsParams.input).deep.equals(expectedAwsParams);
        }));
        it('should send multiple request for large amount of keys', sinonTest(async function () {
            const keys = new Array(100);
            for (let i = 0; i < keys.length; i++) {
                keys[i] = {
                    id: i,
                    type: 'a'
                }
            }
            const params: Dynamodel.BatchDeleteInput = {
                table: fakeTable,
                keys: keys
            };
            dynamoDBMock.on(BatchWriteCommand).resolves({})
            const awsRequestStub = dynamoDBMock.send;
            const request = new BatchDeleteRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams['RequestItems']['dev-fake']).have.lengthOf(25);
            expect(awsRequestStub.callCount).equals(4);
        }));
    });
});