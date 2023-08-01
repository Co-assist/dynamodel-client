import { expect } from 'chai';
import * as Dynamodel from '../../src';
import { mergeItemCollectionMetrics, mergeBatchDeleteUnprocessedKeys, mergeBatchGetUnprocessedKeys, mergeBatchPutUnprocessedItems } from '../../src/util/dynamoOutputUtils';
import { BatchWriteItemOutput, ItemCollectionMetrics } from '@aws-sdk/client-dynamodb';

describe('#dynamoOutputUtils', function () {
    describe('#mergeItemCollectionMetrics', function () {
        it('should exists', function () {
            expect(mergeItemCollectionMetrics).to.be.a('function');
        });
        it('should merge item collection metrics', function () {
            function fakeItemCollectionMetric(): ItemCollectionMetrics {
                return {
                    ItemCollectionKey: {},
                    SizeEstimateRangeGB: [1, 3]
                };
            }
            function fakeResponse(): BatchWriteItemOutput {
                return {
                    ItemCollectionMetrics: {
                        table1: [fakeItemCollectionMetric()],
                        table2: [fakeItemCollectionMetric()]
                    }
                };
            }
            const responses: BatchWriteItemOutput[] = [
                fakeResponse(),
                fakeResponse()
            ];
            const expected: ItemCollectionMetrics[] = [
                {
                    ItemCollectionKey: {},
                    SizeEstimateRangeGB: [1, 3]
                },
                {
                    ItemCollectionKey: {},
                    SizeEstimateRangeGB: [1, 3]
                }
            ];
            const result = mergeItemCollectionMetrics(responses, 'table1');
            expect(result).deep.equals(expected);
        });
    });
    describe('#mergeBatchDeleteUnprocessedKeys', function () {
        it('should exists', function () {
            expect(mergeBatchDeleteUnprocessedKeys).to.be.a('function');
        });
        it('should merge batch delete unprocesses keys', function () {
            function fakeResponse() {
                return {
                    UnprocessedItems: {
                        table1: [
                            {
                                DeleteRequest: {
                                    Key: {
                                        type: 'test'
                                    }
                                }
                            }
                        ]
                    },
                    // @ts-ignore
                    $response: {}
                } as unknown as BatchWriteItemOutput;
            };
            const responses: BatchWriteItemOutput[] = [
                fakeResponse(),
                fakeResponse()
            ];
            const expected: Dynamodel.AttributeMap[] = [
                {
                    type: 'test'
                },
                {
                    type: 'test'
                }
            ];
            const result = mergeBatchDeleteUnprocessedKeys(responses, 'table1');
            expect(result).deep.equals(expected);
        });
    });
    describe('#mergeBatchGetUnprocessedKeys', function () {
        it('should exists', function () {
            expect(mergeBatchGetUnprocessedKeys).to.be.a('function');
        });
        it('should merge batch get unprocesses keys', function () {
            function fakeResponse() {
                return {
                    UnprocessedKeys: {
                        table1: {
                            Keys: [
                                {
                                    type: 'test'
                                }
                            ]
                        }
                    },
                    // @ts-ignore
                    $response: {}
                } as unknown as BatchWriteItemOutput;
            };
            const responses: BatchWriteItemOutput[] = [
                fakeResponse(),
                fakeResponse()
            ];
            const expected: Dynamodel.AttributeMap[] = [
                {
                    type: 'test'
                },
                {
                    type: 'test'
                }
            ];
            const result = mergeBatchGetUnprocessedKeys(responses, 'table1');
            expect(result).deep.equals(expected);
        });
    });
    describe('#mergeBatchPutUnprocessedItems', function () {
        it('should exists', function () {
            expect(mergeBatchPutUnprocessedItems).to.be.a('function');
        });
        it('should merge batch put unprocesses keys', function () {
            function fakeResponse() {
                return {
                    UnprocessedItems: {
                        table1: [
                            {
                                PutRequest: {
                                    Item: {
                                        type: 'test'
                                    }
                                }
                            }
                        ]
                    },
                    // @ts-ignore
                    $response: {}
                } as unknown as BatchWriteItemOutput;
            };
            const responses: BatchWriteItemOutput[] = [
                fakeResponse(),
                fakeResponse()
            ];
            const expected: Dynamodel.AttributeMap[] = [
                {
                    type: 'test'
                },
                {
                    type: 'test'
                }
            ];
            const result = mergeBatchPutUnprocessedItems(responses, 'table1');
            expect(result).deep.equals(expected);
        });
    });
});