import { DeleteRequest } from '../../src/request/deleteRequest';
import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { documentClient } from '../testUtils';
import { fakeTable } from './utils';
import { equals } from '../../src/expression/conditionExpression';
import { sortKey, value } from '../../src/expression/expression';
import * as Dynamodel from '../../src';
import { DeleteItemCommand, DeleteItemCommandOutput } from '@aws-sdk/client-dynamodb';

describe('#deleteRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
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
            const params: Dynamodel.DeleteInput = {
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
            const expectedAwsParams = {
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
            dynamoDBMock.on(DeleteItemCommand).resolves(<DeleteItemCommandOutput><unknown>{ Attributes: { id: 1, type: 'b' } });
            const awsRequestStub = dynamoDBMock.send;
            const request = new DeleteRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});