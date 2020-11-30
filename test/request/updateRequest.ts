import { expect } from 'chai';
import * as AWS from 'aws-sdk';
import { sinonTest } from '../testUtils';
import { UpdateRequest } from '../../src/request/updateRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import { and, attributeExists } from '../../src/expression/conditionExpression';
import { hashKey, sortKey, path, value } from '../../src/expression/expression';
import { Updatable } from '../../src/expression/updateExpression';
import { DynamoModel } from '../../src';

describe('#updateRequest', function () {
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
            const params: DynamoModel.UpdateItemInput = {
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
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
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
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
                promise: () => Promise.resolve({})
            });
            const request = new UpdateRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should test params conversion : update from an expression', sinonTest(async function () {
            const params: DynamoModel.UpdateExpressionInput = {
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
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
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
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
                promise: () => Promise.resolve({})
            });
            const request = new UpdateRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should test, with a model, params conversion : update from an expression', sinonTest(async function () {
            const params: DynamoModel.UpdateExpressionInput = {
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
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
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
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
                promise: () => Promise.resolve({ Attributes: 'bblop' })
            });
            const request = new UpdateRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});