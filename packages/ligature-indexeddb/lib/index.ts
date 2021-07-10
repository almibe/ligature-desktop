/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Ligature, ReadTx, WriteTx, Dataset } from "@ligature/ligature";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import { LIDBReadTx } from './lidbreadtx';
import { LIDBWriteTx } from './lidbwritetx';

const datasets = 'datasets';
const statements = 'statements';
const entities = 'entities';
const attributes = 'attributes';
const stringValues = 'stringValues'
const byteArrayValues = 'byteArrayValues'
const objectStores = [datasets, statements, entities, attributes, stringValues, byteArrayValues];

export async function openLigatureIndexedDB(name: string): Promise<Ligature> {
    let db = await openDB(name, 1, {
        upgrade: (db) => {
            db.createObjectStore(datasets, {
                autoIncrement: true
            }).createIndex("name", "name", { unique: true });
            db.createObjectStore(statements);
            db.createObjectStore(entities, {
                autoIncrement: true
            }).createIndex("id", "id", { unique: true });
            db.createObjectStore(attributes, {
                autoIncrement: true
            }).createIndex("name", "name", { unique: true });
            db.createObjectStore(stringValues, {
                autoIncrement: true
            }).createIndex("value", "value", { unique: true });
            db.createObjectStore(byteArrayValues, {
                autoIncrement: true
            }).createIndex("value", "value", { unique: true });        
        }
    });
    return new LigatureIndexedDB(db);
}

class LigatureIndexedDB implements Ligature {
    private db: IDBPDatabase;
    private _isOpen = true;

    constructor(db: IDBPDatabase) {
        this.db = db;
    }

    async allDatasets(): Promise<Array<Dataset>> {
        let res = Array<Dataset>();
        await (await this.db.getAll("datasets")).forEach(d => res.push(d));
        return res;
    }

    createDataset(dataset: Dataset): Promise<Dataset> {
        throw new Error('Not implemented');
        //return this.db.table("datasets").put({dataset: dataset.name}).then(() => dataset);
    }

    deleteDataset(dataset: Dataset): Promise<Dataset> {
        throw new Error('Not implemented');
        //return this.db.table("datasets").delete(dataset.name).then(() => dataset);
    }

    datasetExists(dataset: Dataset): Promise<boolean> {
        throw new Error('Not implemented');
        //return this.db.table("datasets").get(dataset.name).then(ds => ds !== undefined);
    }

    matchDatasetPrefix(prefix: string): Promise<Array<Dataset>> {
        throw new Error('Not implemented');
        //return this.db.table("datasets").where("dataset").startsWith(prefix).toArray().then(arr => arr.map(val => new Dataset(val))); //TODO map before toArray
    }

    matchDatasetRange(start: string, end: string): Promise<Array<Dataset>> {
        throw new Error('Not implemented');
        //return this.db.table("datasets").where("dataset").between(start, end).toArray().then(arr => arr.map(val => new Dataset(val))); //TODO map before toArray
    }

    query<T>(dataset: Dataset, fn: (readTx: ReadTx) => Promise<T>): Promise<T> {
        throw new Error('Not implemented');
        // return this.db.transaction("r", this.db.table("statements"), tx => {
        //     let readtx = new LDReadTx(tx, dataset);
        //     return fn(readtx);
        // });
    }

    write<T>(dataset: Dataset, fn: (writeTx: WriteTx) => Promise<T>): Promise<T> {
        throw new Error('Not implemented');
        // return this.db.transaction("rw", this.db.table("statements"), tx => {
        //     let writetx = new LDWriteTx(tx, dataset);
        //     return fn(writetx);
        // });
    }

    close(deleteDb: boolean = false): Promise<void> { //TODO needs error handling
        if (deleteDb) {
            objectStores.forEach(os => {
                //TODO delete all entries in os
            });
            this.db.close();
            this._isOpen = false;
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
