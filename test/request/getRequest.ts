import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { GetRequest } from '../../src/request/getRequest';
import { documentClient } from '../testUtils';
import { fakeTable } from './utils';
import { path } from '../../src/expression/expression';
import * as Dynamodel from '../../src';
import { GetItemCommand, GetItemCommandOutput } from '@aws-sdk/client-dynamodb';

describe('#getRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
    describe('#constructor', function () {
        it('should exists', function () {
            expect(GetRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                key: {}
            };
            const request = new GetRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(GetRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(GetRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion', sinonTest(async function () {
            const params: Dynamodel.GetInput = {
                key: {
                    id: 1,
                    type: 'a'
                },
                table: fakeTable,
                consistentRead: true,
                projection: [path('value')],
                returnConsumedCapacity: 'TOTAL'
            };
            const expectedAwsParams = {
                ConsistentRead: true,
                ExpressionAttributeNames: {
                    '#n0': 'value',
                    '#n1': 'id',
                    '#n2': 'type'
                },
                Key: {
                    'id': 1,
                    'type': 'a'
                },
                ProjectionExpression: '#n0, #n1, #n2',
                ReturnConsumedCapacity: 'TOTAL',
                TableName: 'dev-fake',
            };
            dynamoDBMock.on(GetItemCommand).resolves(<GetItemCommandOutput><unknown>{ Item: { id: 1, type: 'b' } })
            const awsRequestStub = dynamoDBMock.send
            const request = new GetRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});