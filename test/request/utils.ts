import { model } from '../../src/model';
import { Table } from '../../src/table';
import { Schemaless, Schema } from '../../src/schema';

interface FakeA {
    id?: number;
    type?: string;
    value?: any;
}

export class FakeAModel extends model(new Schema<FakeA>({
    id: {
        test: (value) => true
    },
    type: {
        test: (value) => value === 'a'
    },
    value: {
        test: (value) => true
    }
})) {

    private _type?: string;

    get type() {
        return this._type || 'a' as const;
    }

    set type(value) {
        this._type = value;
    }
}

interface FakeB {
    [key: string]: any;
    type?: 'b';
};

export  class FakeBModel extends model(new Schemaless<FakeB>({
    type: {
        test: (value) => value === 'b'
    }
})) {

    get type() {
        return 'b' as const;
    }

    set type(value) { }
}

export const fakeTable = new Table({
    name: 'fake',
    models: [FakeAModel, FakeBModel],
    primaryKey: {
        hash: 'id',
        sort: 'type'
    }
});