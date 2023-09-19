import AWS from 'aws-sdk';
import sinon from 'sinon';
import sinon_test from 'sinon-test';

export const sinonTest = sinon_test(sinon);
export const documentClient = new AWS.DynamoDB.DocumentClient();