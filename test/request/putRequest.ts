import { expect } from 'chai';
import { dynamoDBMock, sinonTest } from '../testUtils';
import { PutRequest } from '../../src/request/putRequest';
import { documentClient } from '../testUtils';
import { fakeTable, FakeAModel } from './utils';
import { and, attributeNotExists } from '../../src/expression/conditionExpression';
import { hashKey, sortKey } from '../../src/expression/expression';
import * as Dynamodel from '../../src';
import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';

describe('#putRequest', function () {
    beforeEach(() => {
        dynamoDBMock.reset();
    });
    describe('#constructor', function () {
        it('should exists', function () {
            expect(PutRequest).to.be.a('function');
        });
        it('should be instanciable', function () {
            const params = {
                table: fakeTable,
                item: new FakeAModel({})
            };
            const request = new PutRequest(documentClient, params, 'test');
            expect(request).to.be.instanceOf(PutRequest);
        });
    });
    describe('#execute', function () {
        it('should exists', function () {
            expect(PutRequest.prototype.execute).to.be.a('function');
        });
        it('should test params conversion', sinonTest(async function () {
            const params: Dynamodel.PutInput = {
                condition: and(
                    attributeNotExists(hashKey()),
                    attributeNotExists(sortKey())
                ),
                item: new FakeAModel({ id: 1, value: 1 }),
                returnConsumedCapacity: 'TOTAL',
                returnItemCollectionMetrics: 'SIZE',
                returnValues: 'ALL_OLD',
                table: fakeTable,
            };
            const expectedAwsParams = {
                ConditionExpression: '(attribute_not_exists(#n0) AND attribute_not_exists(#n1))',
                ExpressionAttributeNames: {
                    '#n0': 'id',
                    '#n1': 'type'
                },
                ExpressionAttributeValues: undefined,
                Item: {
                    'id': 1,
                    'type': 'a',
                    'value': 1
                },
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnConsumedCapacity: 'TOTAL',
                ReturnValues: 'ALL_OLD',
                TableName: 'dev-fake'
            };
            dynamoDBMock.on(PutItemCommand).resolves(<PutItemCommandOutput><unknown>{ Attributes: [] });
            const awsRequestStub = dynamoDBMock.send
            const request = new PutRequest(documentClient, params, 'dev');
            await request.execute();
            const awsParams = awsRequestStub.args[0][0].input;
            expect(awsParams).deep.equals(expectedAwsParams);
        }));
    });
});