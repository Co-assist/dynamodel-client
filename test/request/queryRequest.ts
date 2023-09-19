import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { QueryRequest } from '../../src/request/queryRequest';
import { documentClient } from '../testUtils';
import { fakeTable } from './utils';
import { path, value, sortKey } from '../../src/expression/expression';
import { attributeType, equals } from '../../src/expression/conditionExpression';
import * as Dynamodel from '../../src';
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';


describe('#queryRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
    describe('#constructor', function () {
        it('should exists', function () {
            expect(QueryRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params: Dynamodel.QueryInput = {
                table: fakeTable
            };
            const request = new QueryRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(QueryRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(QueryRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion 1', sinonTest(async function () {
            const params: Dynamodel.QueryInput = {
                consistentRead: true,
                countLimit: 10,
                exclusiveStartKey: {
                    id: 1,
                    type: 'a'
                },
                filter: attributeType(path('value'), value('N')),
                keyCondition: equals(sortKey(), value('type')),
                pageSize: 100,
                projection: [path('value')],
                returnConsumedCapacity: 'TOTAL',
                scanCountLimit: 1000,
                scanIndexForward: true,
                select: 'ALL_PROJECTED_ATTRIBUTES',
                table: fakeTable,
            };
            const expectedAwsParams: QueryCommandInput = {
                ConsistentRead: true,
                ExclusiveStartKey: {
                    'id': 1,
                    'type': 'a'
                },
                ExpressionAttributeNames: {
                    '#n0': 'value',
                    '#n1': 'id',
                    '#n2': 'type'
                },
                ExpressionAttributeValues: {
                    ':v0': 'N',
                    ':v1': 'type'
                },
                FilterExpression: 'attribute_type(#n0, :v0)',
                IndexName: undefined,
                KeyConditionExpression: '#n2 = :v1',
                Limit: 100,
                ProjectionExpression: '#n0, #n1, #n2',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: true,
                Select: 'ALL_PROJECTED_ATTRIBUTES',
                TableName: 'dev-fake'
            };
            dynamoDBMock.on(QueryCommand).resolves({});
            const awsRequestStub = dynamoDBMock.send;
            const request = new QueryRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should test params conversion 2', sinonTest(async function () {
            const params: Dynamodel.QueryInput = {
                consistentRead: true,
                countLimit: 10,
                exclusiveStartKey: {
                    id: 1,
                    type: 'a'
                },
                filter: attributeType(path('value'), value('N')),
                keyCondition: equals(sortKey(), value('type')),
                pageSize: 100,
                projection: [path('value')],
                returnConsumedCapacity: 'TOTAL',
                scanCountLimit: 1000,
                scanIndexForward: true,
                select: 'ALL_PROJECTED_ATTRIBUTES',
                table: fakeTable,
            };
            const expectedAwsParams: QueryCommandInput = {
                ConsistentRead: true,
                ExclusiveStartKey: {
                    'id': 1,
                    'type': 'a'
                },
                ExpressionAttributeNames: {
                    '#n0': 'value',
                    '#n1': 'id',
                    '#n2': 'type'
                },
                ExpressionAttributeValues: {
                    ':v0': 'N',
                    ':v1': 'type'
                },
                FilterExpression: 'attribute_type(#n0, :v0)',
                IndexName: undefined,
                KeyConditionExpression: '#n2 = :v1',
                Limit: 100,
                ProjectionExpression: '#n0, #n1, #n2',
                ReturnConsumedCapacity: 'TOTAL',
                ScanIndexForward: true,
                Select: 'ALL_PROJECTED_ATTRIBUTES',
                TableName: 'dev-fake'
            };
            dynamoDBMock.on(QueryCommand).resolves({ Count: 5, ScannedCount: 5, LastEvaluatedKey: { "blip": 1 }, Items: [{ id: 2, type: 'a' }, { id: 2, type: 'a' }] })
            const awsRequestStub = dynamoDBMock.send;
            const request = new QueryRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});