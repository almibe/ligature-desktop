# @ligature/ligature-indexeddb

This project stores Ligature data in IndexedDB.

## KV Storage

```
*Note*: this project currently isn't managing IndexedDB versions like you would for a production system.
It's still under development and is mostly intended as a proof of concept/demo currently.
It's expected that most usage is deleting DBs between uses or manually tracking when the schema changes.
I plan on changing this eventually and will begin to handle versioning correctly.
```

KV is a storage project for Ligature that treats IndexedDB similar to a key-value store like LMDB or RocksDB.
Currently this project uses six object stores and all Datasets share them.
Below is an explanation of the stores created/used.

| Object Store      | Key  | Value                                 | Indexes          |
| ----------------- | ---- | ------------------------------------- | ---------------- |
| datasets          | auto | { name: string }                      | name             |
| statements        | u8[] | -                                     | -                |
| entities          | auto | { id: string, datasets: number[] }    | id, datasets*    |
| attributes        | auto | { name: string, datasets: number[] }  | name, datasets*  |
| string values     | auto | { value: string, datasets: number[] } | value, datasets* |
| byte array values | auto | { value: u8[], datasets: number[] }   | value, datasets* |

### How the Statements Object Store works

The Statements Object Store is kind of it's own thing so it's worth explaining that in greater detail.
It is roughly based on the hexastore pattern, but includes the Context.
Since Contexts are unique, this only involves adding one extra entry per Statement so it looks like more a heptastore.
All seven of the entries are a variant of the first so below are the first two in detail and the remaining should be obvious.

| Name | Types                                                | Values                                                                           |
| ---- | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| EAVC | number ~ u8 ~ number ~ number ~ u8 ~ number ~ number | Dataset ID, Prefix, Entity ID, Attribute ID, Value Type ID, Value, Context ID    |
| EVAC | number ~ u8 ~ number ~ u8 ~ number ~ number ~ number | Dataset ID, Prefix, Entity ID, Value Type ID, Value, Attribute ID, Context ID    |
| AEVC | ...                                                  | ...                                                                              |
| AVEC | ...                                                  | ...                                                                              |
| VEAC | ...                                                  | ...                                                                              |
| VAEC | ...                                                  | ...                                                                              |
| CEAV | ...                                                  | ...                                                                              |

Value Type ID is represented as follows:

| Name       | ID | Value               |
| ---------- | -- | ------------------- |
| Entity     | 0  | Entity ID           |
| Integer    | 1  | i64                 |
| Float      | 2  | f64                 |
| String     | 3  | String Value ID     |
| Byte Array | 4  | Byte Array Value ID |

## Simple Storage

Simple storage is simpler implementation of Ligature that is stored inside IndexedDB.
It mainly exists for prototyping and as a benchmark.
It contains only two Object Stores.
The first `datasets` is the same as above.
The second `statements` contains all the parts of a statement and uses IndexedDB indexes for access.

| Object Store      | Key  | Value             | Indexes          |
| ----------------- | ---- | ----------------- | ---------------- |
| datasets          | auto | { name: string }  | name             |
| statements        | auto | see below         | see below        |

| Field       | Types                    |
| ----------- | ------------------------ |
| dataset     | string                   |
| entity      | string                   |
| attribute   | string                   |
| value type  | number                   |
| value value | string number Uint8Array |
| context     | string                   |

| Index Name | Key Paths                                                    | Unique? |
| ---------- | ------------------------------------------------------------ | ------- |
| dataset    | dataset                                                      | false   |
| entity     | [dataset, entity]                                            | false   |
| attribute  | [dataset, attribute]                                         | false   |
| value      | [dataset, valueType, valueValue]                             | false   |
| context    | [dataset, context]                                           | true    |
| statement  | [dataset, entity, attribute, valueType, valueValue, context] | true    |
