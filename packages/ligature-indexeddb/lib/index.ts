/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Ligature, ReadTx, WriteTx, Dataset } from "@ligature/ligature";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from "idb";
import { LIDBReadTx } from './lidbreadtx';
import { LIDBWriteTx } from './lidbwritetx';

export async function openLigature(name: string) {
    let db = await openDB(name);
    return new LigatureIndexedDB(db);
}

export class LigatureIndexedDB implements Ligature {
    private db: IDBPDatabase;
    private _isOpen = true;

    constructor(db: IDBPDatabase) {
        this.db = db;
    }

    allDatasets(): Promise<Array<Dataset>> {
        throw new Error('Not implemented');
        //return this.db.table("datasets").toArray().then(arr => arr.map(val => new Dataset(val.dataset))); //TODO map before toArray
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

    close(deleteDb: boolean = false): Promise<void> {
        throw new Error('Not implemented');
        // if (deleteDb) {
        //     return this.db.delete()
        //         .then(() => { this.db.close() })
        //         .then(() => { this._isOpen = false });
        // } else {
        //     this.db.close();
        //     this._isOpen = false;
        //     return Promise.resolve();
        // }
    }

    isOpen(): boolean {
        return this._isOpen
    }
}
