/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Ligature, ReadTx, WriteTx, Dataset } from "@ligature/ligature";
import { openDB, deleteDB, IDBPDatabase } from "idb";
import { SimpleReadTx } from './simplereadtx';
import { SimpleWriteTx } from './simplewritetx';

const datasets = 'datasets';
const statements = 'statements';
const objectStores = [datasets, statements];

export async function openLigatureSimpleIndexedDB(name: string): Promise<Ligature> {
    let db = await openDB(name, 1, {
        upgrade: (db) => {
            db.createObjectStore(datasets, {
                autoIncrement: true
            }).createIndex("name", "name", { unique: true });

            let statementsOS = db.createObjectStore(statements, { autoIncrement: true } );
            statementsOS.createIndex("dataset", "dataset", { unique: false } );
            statementsOS.createIndex("entity", ["dataset", "entity"], { unique: false } );
            statementsOS.createIndex("attribute", ["dataset", "attribute"], { unique: false } );
            statementsOS.createIndex("value", ["dataset", "valueType", "valueValue"], { unique: false } );
            statementsOS.createIndex("context", ["dataset", "context"], { unique: true } );
            statementsOS.createIndex("statement", ["dataset", "entity", "attribute", "valueType", "valueValue", "context"], { unique: true });
        }
    });
    return new LigatureIndexedDB(db);
}

class LigatureIndexedDB implements Ligature {
    private db: IDBPDatabase;
    private _isOpen = true;
    private name: string;

    constructor(db: IDBPDatabase) {
        this.db = db;
        this.name = db.name;
    }

    async allDatasets(): Promise<Array<Dataset>> {
        let res = Array<Dataset>();
        await (await this.db.getAll("datasets")).forEach(d => res.push(new Dataset(d.name)));
        return res;
    }

    async createDataset(dataset: Dataset): Promise<Dataset> {
        let tx = this.db.transaction(datasets, "readwrite", {durability: 'strict'});
        let dStore = tx.store;
        let res = await dStore.index('name').get(dataset.name);
        if (res == null) {
            await dStore.add({name: dataset.name});
            await tx.done;
            return Promise.resolve(dataset);
        } else {
            await tx.done;
            return Promise.resolve(dataset);
        }
    }

    async deleteDataset(dataset: Dataset): Promise<Dataset> {
        let tx = this.db.transaction(objectStores, "readwrite", { durability: "strict" });
        let dStore = tx.objectStore(datasets)
        let dsKey = await dStore.index('name').getKey(dataset.name);
        if (dsKey == null) {
            await tx.done;
            return Promise.resolve(dataset);
        } else {
            dStore.delete(dsKey);
            //TODO remove all Statements involving the given Dataset from the statements object stores
            return Promise.resolve(dataset);
        }
    }

    async datasetExists(dataset: Dataset): Promise<boolean> {
        let tx = this.db.transaction(datasets, "readonly");
        let dStore = tx.store;
        let res = await dStore.index('name').get(dataset.name);
        if (res == null) {
            await tx.done;
            return Promise.resolve(false);
        } else {
            await tx.done;
            return Promise.resolve(true);
        }
    }

    async matchDatasetPrefix(prefix: string): Promise<Array<Dataset>> {
        let tx = this.db.transaction(datasets, "readonly");
        let dStore = tx.store;
        let endLen = prefix.length-1;
        let prefixEnd = prefix.slice(0, endLen) + String.fromCharCode(prefix.charCodeAt(endLen)+1);
        let arr = Array<Dataset>();
        (await dStore.index('name').getAll(IDBKeyRange.bound(prefix, prefixEnd, false, true))).forEach((name: { name: string; }) => {
            arr.push(new Dataset(name.name));
        });
        return arr;
    }

    async matchDatasetRange(start: string, end: string): Promise<Array<Dataset>> {
        let tx = this.db.transaction(datasets, "readonly");
        let dStore = tx.store;
        let arr = Array<Dataset>();
        (await dStore.index('name').getAll(IDBKeyRange.bound(start, end, false, true))).forEach((name: { name: string; }) => {
            arr.push(new Dataset(name.name));
        });
        return arr;
    }

    async query<T>(dataset: Dataset, fn: (readTx: ReadTx) => Promise<T>): Promise<T> {
        let tx = this.db.transaction(objectStores, "readonly");
        let key = await tx.objectStore(datasets).index('name').getKey(dataset.name);
        if (key == undefined) {
            throw new Error("Dataset '" + dataset.name + "' doesn't exist.");
        } else {
            let readTx = new SimpleReadTx(tx, dataset, key.valueOf() as number);
            return fn(readTx);    
        }
    }

    async write<T>(dataset: Dataset, fn: (writeTx: WriteTx) => Promise<T>): Promise<T> {
        let tx = this.db.transaction(objectStores, "readwrite", { durability: "strict" });
        let key = await tx.objectStore(datasets).index('name').getKey(dataset.name);
        if (key == undefined) {
            throw new Error("Dataset '" + dataset.name + "' doesn't exist.");
        } else {
            let writeTx = new SimpleWriteTx(tx, dataset, key.valueOf() as number);
            return fn(writeTx);
        }
    }

    close(deleteDb: boolean = false): Promise<void> { //TODO needs error handling
        if (deleteDb) {
            this.db.close();
            this._isOpen = false;
            deleteDB(this.name);
            return Promise.resolve();
        } else {
            this.db.close();
            this._isOpen = false;
            return Promise.resolve();
        }
    }

    isOpen(): boolean {
        return this._isOpen
    }
}
