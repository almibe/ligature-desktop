# @ligature/ligature-indexeddb

This project stores ligature in IndexedDB.

## Storeage

```
*Note*: this project currently isn't managing IndexedDB versions like you would for a production system.
It's still under development and is mostly intented as a proof of concept/demo currently.
It's expected that most usage is deleting DBs between uses or manually tracking when the schema changes.
I plan on changing this eventually and will begin to handle versioning correctly.
```

Currently this project uses six object stores and all Datasets share them.
Below is an explaination of the stores created/used.

| Object Store      | Key  | Value             | Indexes | 
| ----------------- | ---- | ----------------- | ------- |
| datasets          | auto | { name: string }  | name    |
| statements        | u8[] | -                 | -       |
| entities          | auto | { id: string }    | id      |
| attributes        | auto | { name: string }  | name    |
| string values     | auto | { value: string } | value   |
| byte array values | auto | { value: u8[] }   | value   |
