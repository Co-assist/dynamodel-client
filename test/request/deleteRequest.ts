import { DeleteRequest } from '../../src/request/deleteRequest';
import { expect } from 'chai';
import * as AWS from 'aws-sdk';
import { sinonTest } from '../testUtils';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import { equals } from '../../src/expression/conditionExpression';
import { sortKey, value } from '../../src/expression/expression';
import { DynamoModel } from '../../src';

describe('#deleteRequest', function () {
    describe('#constructor', function () {
        it('should exists', function () {
            expect(DeleteRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                key: {}
            };
            const request = new DeleteRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(DeleteRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(DeleteRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion', sinonTest(async function () {
            const params: DynamoModel.DeleteInput = {
                condition: equals(sortKey(), value('a')),
                key: {
                    id: 1,
                    type: 'a'
                },
                returnConsumedCapacity: 'TOTAL',
                returnItemCollectionMetrics: 'SIZE',
                returnValues: 'ALL_OLD',
                table: fakeTable
            };
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
                ConditionExpression: '#n0 = :v0',
                ExpressionAttributeNames: {
                    '#n0': 'type'
                },
                ExpressionAttributeValues: {
                    ':v0': 'a'
                },
                Key: {
                    'id': 1,
                    'type': 'a'
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_OLD',
                TableName: 'dev-fake'
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete').returns({
                promise: () => Promise.resolve({ Attributes: { id: 1, type: 'b' } })
            });
            const request = new DeleteRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});