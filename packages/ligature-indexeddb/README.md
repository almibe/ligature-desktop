# @ligature/ligature-indexeddb

This project stores Ligature data in IndexedDB.

## Storage

```
*Note*: this project currently isn't managing IndexedDB versions like you would for a production system.
It's still under development and is mostly intended as a proof of concept/demo currently.
It's expected that most usage is deleting DBs between uses or manually tracking when the schema changes.
I plan on changing this eventually and will begin to handle versioning correctly.
```

Currently this project uses six object stores and all Datasets share them.
Below is an explanation of the stores created/used.

| Object Store      | Key  | Value                                 | Indexes |
| ----------------- | ---- | ------------------------------------- | ------- |
| datasets          | auto | { name: string }                      | name    |
| statements        | u8[] | -                                     | -       |
| entities          | auto | { id: string, datasets: number[] }    | id      |
| attributes        | auto | { name: string, datasets: number[] }  | name    |
| string values     | auto | { value: string, datasets: number[] } | value   |
| byte array values | auto | { value: u8[], datasets: number[] }   | value   |

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
