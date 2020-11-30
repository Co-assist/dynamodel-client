import { expect } from 'chai';
import * as AWS from 'aws-sdk';
import { sinonTest } from '../testUtils';
import { ScanRequest } from '../../src/request/scanRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel, FakeBModel } from './utils';
import { path } from '../../src/expression/expression';
import { sortKey } from '../../src/expression/expression';
import { attributeType, equals } from '../../src/expression/conditionExpression';
import { value } from '../../src/expression/expression';
import { DynamoModel } from '../../src';

describe('#scanRequest', function () {
    describe('#constructor', function () {
        it('should exists', function () {
            expect(ScanRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable
            };
            const request = new ScanRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(ScanRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(ScanRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion 1', sinonTest(async function () {
            const params: DynamoModel.ScanInput = {
                consistentRead: true,
                countLimit: 10,
                exclusiveStartKey: {
                    id: 1,
                    type: 'a'
                },
                filter: attributeType(path('value'), value('N')),
                pageSize: 100,
                projection: [path('value')],
                returnConsumedCapacity: 'TOTAL',
                scanCountLimit: 1000,
                segment: undefined,
                select: 'ALL_PROJECTED_ATTRIBUTES',
                table: fakeTable,
                totalSegments: undefined,
            };
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.ScanInput = {
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
                    ':v0': 'N'
                },
                FilterExpression: 'attribute_type(#n0, :v0)',
                IndexName: undefined,
                Limit: 100,
                ProjectionExpression: '#n0, #n1, #n2',
                ReturnConsumedCapacity: 'TOTAL',
                Segment: undefined,
                Select: 'ALL_PROJECTED_ATTRIBUTES',
                TableName: 'dev-fake',
                TotalSegments: undefined
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'scan').returns({
                promise: () => Promise.resolve({ Count: 5, ScannedCount: 5, LastEvaluatedKey: { "blip": 1 }, Items: [{ id: 2, type: 'a' }, { id: 2, type: 'a' }] })
            });
            const request = new ScanRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
        it('should test params conversion 2', sinonTest(async function () {
            const params: DynamoModel.ScanInput = {
                consistentRead: true,
                countLimit: 10,
                exclusiveStartKey: {
                    id: 1,
                    type: 'a'
                },
                filter: attributeType(path('value'), value('N')),
                pageSize: 100,
                projection: [path('value')],
                returnConsumedCapacity: 'TOTAL',
                scanCountLimit: 1000,
                segment: undefined,
                select: 'ALL_PROJECTED_ATTRIBUTES',
                table: fakeTable,
                totalSegments: undefined,
            };
            const expectedAwsParams: AWS.DynamoDB.DocumentClient.ScanInput = {
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
                    ':v0': 'N'
                },
                FilterExpression: 'attribute_type(#n0, :v0)',
                IndexName: undefined,
                Limit: 100,
                ProjectionExpression: '#n0, #n1, #n2',
                ReturnConsumedCapacity: 'TOTAL',
                Segment: undefined,
                Select: 'ALL_PROJECTED_ATTRIBUTES',
                TableName: 'dev-fake',
                TotalSegments: undefined
            };
            const awsRequestStub = this.stub(AWS.DynamoDB.DocumentClient.prototype, 'scan').returns({
                promise: () => Promise.resolve({})
            });
            const request = new ScanRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0];
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});