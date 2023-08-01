import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { UpdateRequest } from '../../src/request/updateRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel } from './utils';
import { and, attributeExists } from '../../src/expression/conditionExpression';
import { hashKey, sortKey, path, value } from '../../src/expression/expression';
import { Updatable } from '../../src/expression/updateExpression';
import * as Dynamodel from '../../src';
import { UpdateItemCommand, UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';

describe('#updateRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
    describe('#constructor', function () {
        it('should exists', function () {
            expect(UpdateRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                item: new FakeAModel({ id: 1, value: 3 })
            };
            const request = new UpdateRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(UpdateRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(UpdateRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion : update from an item', sinonTest(async function () {
            const params: Dynamodel.UpdateItemInput = {
                condition: and(
                    attributeExists(hashKey()),
                    attributeExists(sortKey())
                ),
                item: new FakeAModel({ id: 1, value: 5 }),
                returnConsumedCapacity: 'TOTAL',
                returnItemCollectionMetrics: 'SIZE',
                returnValues: 'ALL_NEW',
                table: fakeTable
            };
            const expectedAwsParams = {
                ConditionExpression: '(attribute_exists(#n0) AND attribute_exists(#n1))',
                ExpressionAttributeNames: {
                    '#n0': 'id',
                    '#n1': 'type',
                    '#n2': 'value'
                },
                ExpressionAttributeValues: {
                    ':v0': 5
                },
                Key: {
                    'id': 1,
                    'type': 'a'
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_NEW',
                TableName: 'dev-fake',
                UpdateExpression: 'SET #n2 = :v0'
            };
            dynamoDBMock.on(UpdateItemCommand).resolves(<UpdateItemCommandOutput><unknown>{})
            const awsRequestStub = dynamoDBMock.send;
            const request = new UpdateRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should test params conversion : update from an expression', sinonTest(async function () {
            const params: Dynamodel.UpdateExpressionInput = {
                condition: and(
                    attributeExists(hashKey()),
                    attributeExists(sortKey())
                ),
                key: { id: 1, type: 'a' },
                updatable: new Updatable().set(path('value'), value(5)),
                returnConsumedCapacity: 'TOTAL',
                returnItemCollectionMetrics: 'SIZE',
                returnValues: 'ALL_NEW',
                table: fakeTable
            };
            const expectedAwsParams = {
                ConditionExpression: '(attribute_exists(#n0) AND attribute_exists(#n1))',
                ExpressionAttributeNames: {
                    '#n0': 'id',
                    '#n1': 'type',
                    '#n2': 'value'
                },
                ExpressionAttributeValues: {
                    ':v0': 5
                },
                Key: {
                    'id': 1,
                    'type': 'a'
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_NEW',
                TableName: 'dev-fake',
                UpdateExpression: 'SET #n2 = :v0'
            };
            dynamoDBMock.on(UpdateItemCommand).resolves(<UpdateItemCommandOutput><unknown>{})
            const awsRequestStub = dynamoDBMock.send;
            const request = new UpdateRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should test, with a model, params conversion : update from an expression', sinonTest(async function () {
            const params: Dynamodel.UpdateExpressionInput = {
                condition: and(
                    attributeExists(hashKey()),
                    attributeExists(sortKey())
                ),
                key: new FakeAModel({ id: 1, type: 'a' }),
                updatable: new Updatable().set(path('value'), value(5)),
                returnConsumedCapacity: 'TOTAL',
                returnItemCollectionMetrics: 'SIZE',
                returnValues: 'ALL_NEW',
                table: fakeTable
            };
            const expectedAwsParams = {
                ConditionExpression: '(attribute_exists(#n0) AND attribute_exists(#n1))',
                ExpressionAttributeNames: {
                    '#n0': 'id',
                    '#n1': 'type',
                    '#n2': 'value'
                },
                ExpressionAttributeValues: {
                    ':v0': 5
                },
                Key: {
                    'id': 1,
                    'type': 'a'
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_NEW',
                TableName: 'dev-fake',
                UpdateExpression: 'SET #n2 = :v0'
            };
            dynamoDBMock.on(UpdateItemCommand).resolves(<UpdateItemCommandOutput><unknown>{ Attributes: 'bblop' })
            const awsRequestStub = dynamoDBMock.send;
            const request = new UpdateRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});