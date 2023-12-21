import sinon from 'sinon';
import sinon_test from 'sinon-test';
import { mockClient } from 'aws-sdk-client-mock';

export const sinonTest = sinon_test(sinon);
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamodb = new DynamoDBClient({});
export const documentClient = DynamoDBDocumentClient.from(dynamodb);
export const dynamoDBMock = mockClient(documentClient);
