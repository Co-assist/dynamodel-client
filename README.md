# Dynamodel-client
[![NPM version](https://img.shields.io/npm/v/dynamodel-client.svg)](https://www.npmjs.com/package/dynamodel-client)
[![NPM downloads](https://img.shields.io/npm/dm/dynamodel-client.svg)](https://www.npmjs.com/package/dynamodel-client)
[![Coverage Status](https://codecov.io/gh/Co-assist/dynamodel-client/branch/master/graph/badge.svg)](https://codecov.io/gh/Co-assist/dynamodel-client)



// TODO IN PROGRESS
Dynamodel est une surcouche à `DynamoDB`, plus précisément de son client `AWS.DynamoDB.DocumentClient`.
Il permet d'effectuer les mêmes opérations que sur `DocumentClient` mais avec un meilleur contrôle sur
la rédaction des requêtes ainsi que sur le contrôle des données, aussi bien en lecture qu'en écriture.

## Client

```Typescript
const dbClient = new Dynamodel(new AWS.DynamoDB.DocumentClient());
const dbClient = new Dynamodel(new AWS.DynamoDB.DocumentClient(), 'tablePrefix');
```

## Schema

Les schéma décrivent les objets de la base de données.  
Il est possible d'en créer deux types par défaut,  
les `Schema` qui vont s'appliquer strictement aux objets et  
les `Schemaless` qui ne vont contrôler que les attributs décrit dans le schéma, tout autre
attribut pourra être écrit en base de données.

Schema example:

```Typescript
const fooSchema = new Schema({
    hashKey: {
        test: (value) => typeof value === 'number'
    },
    sortKey: {
        test: (value) => typeof value === 'string' && value.startWith('foo#');
    },
    attr1: {
        test: (value) => typeof value === 'string'
    },
    attr2: {
        test: (value) => value == undefined || typeof value === 'object'
    }
});
```

Schemaless example:

```Typescript
const barSchema = new Schemaless({
    hashKey: {
        test: (value) => typeof value === 'number'
    },
    sortKey: {
        test: (value) => value === 'bar'
    }
});

```

## Model

Modélisation des schéma pour manipuler les éléments de la base de données avec l'ajout de fonctions.

```Typescript
const FooModel = model(barSchema);
FooModel.prototype.sortKey = 'foo';
```

```Typescript
class BarModel extends model(barSchema) {

    get sortKey() {
        return 'bar';
    }

    set sortKey(v) {
        /* read only */
    }
}
```

Advanced usage:

```Typescript
class BazModel extends model(barSchema) {

    private static readonly PREFIX = 'bar#';

    private _sortKey: string;
    private _subkey: string;

    get sortKey() {
        return this._sortKey;
    }

    set sortKey(value) {
        this._sortKey = value;
        this._subKey = value.substring(FooModel.PREFIX.length);
    }

    get subKey() {
        return this._subKey;
    }

    set subKey(value) {
        this._sortKey = FooModel.PREFIX + value;
        this._subKey = value;
    }
}
```

## Table

Décrit une table et enregistre les différents modèles.
Chaque modèle doit avec un schéma déterministe au niveau de sa clé primaire pour permettre d'appliquer
le bon schéma lors des requêtes.

```Typescript
const myTable = new Table({
    name: 'myTable',
    primaryKey: {
        hash: 'hashKey',
        sort: 'sortKey'
    },
    indexes: {
        'sort-index': {
            hash: 'sortKey'
        }
    },
    models: [
        FooModel,
        BarModel
    ],
    modelKey: {
        path: 'modelKeyPath'
    }
});
```

modelKey (optionnel) permet d'identifier le bon modèle à l'aide d'un attribut supplémentaire 
(ex: les modèles d'une table sont différenciés par un autre attribut que ceux de la clé primaire).
## Requests

Liste des opérations du client.

### BatchDelete

Supprime un ensemble d'éléments d'une table depuis leurs clés primaire.

```Typescript
const response = await dbClient.batchDelete({
    table: myTable,
    keys: [
        new FooModel({ hashKey: 1 }),
        new BarModel({ hashKey: 1 })
    ]
});
```

### BatchGet

Récupère un ensemle d'éléments d'une table depuis leurs clés primaire.

```Typescript
const response = await dbClient.batchGet({
    table: myTable,
    keys: [
        new FooModel({ hashKey: 1 }),
        new BarModel({ hashKey: 1 })
    ]
});
```

### BatchPut

Ecrit un ensemble d'éléments d'une table depuis leurs clés primaire.

```Typescript
const response = await dbClient.batchPut({
    table: myTable,
    items: [
        new FooModel({ hashKey: 1, attr1: false, attr2: 'my value' }),
        new BarModel({ hashKey: 1, value: { a: true } })
    ]
});
```

### Delete

```Typescript
const response = await dbClient.delete({
    table: myTable,
    key: new FooBar({ hashKey: 1 }),
    condition: attributeExists(path('attr1'))
});
```

### Get

```Typescript
const response = await dbClient.get({
    table: myTable,
    key: new FooBar({ hashKey: 1 })
});
```

### Put

```Typescript
const response = await dbClient.put({
    table: myTable,
    item: new FooBar({ hashKey: 1, attr1: true }),
    condition: and(
        attributeNotExists(hashKey()),
        attributeNotExists(sortKey())
    )
});
```

### Query

```Typescript
const response = await dbClient.query({
    table: myTable,
    indexName: 'sort-index',
    keyCondition: equals(hashKey(), value('foo'))
});
```

### Scan

```Typescript
const response = await dbClient.scan({
    table: myTable,
    select: 'COUNT'
});
```

### Update item

```Typescript
const response = await dbClient.update({
    table: myTable,
    item: new FooModel({ hashKey: 1, attr1: false }),
    condition: and(
        attributeExists(hashKey()),
        attributeExists(sortKey())
    )
});
```

### Update expression

```Typescript
const response = await dbClient.update({
    table: myTable,
    key: new FooModel({ hashKey: 1 }),
    updatable: new Updatable().set(path('attr1'), value(false)),
    condition: and(
        attributeExists(hashKey()),
        attributeExists(hashKey())
    )
});
```
### AWS SDK Client Mock
[![Package used]](https://github.com/m-radzikowski/aws-sdk-client-mock#dynamodb-documentclient)
Recommended package by aws sdk team to mock clients
https://aws.amazon.com/fr/blogs/developer/mocking-modular-aws-sdk-for-javascript-v3-in-unit-tests/