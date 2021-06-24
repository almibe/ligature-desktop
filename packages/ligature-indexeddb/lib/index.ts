/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Ligature, ReadTx, WriteTx, Dataset } from "@ligature/ligature";
import { Dexie } from "dexie";
import { LDReadTx } from './ldreadtx';
import { LDWriteTx } from './ldwritetx';

export class InMemoryLigature implements Ligature {
    private db: Dexie;
    private _isOpen = true;

    constructor(name: string) {
        new Dexie(name).delete();
        this.db = new Dexie(name);
        this.db.version(1).stores({
            datasets: 'dataset',
            statements: '++id,dataset,entity,attribute,value,&context'
        });
    }

    allDatasets(): Promise<Array<Dataset>> {
        return this.db.table("datasets").toArray().then(arr => arr.map(val => new Dataset(val.dataset))); //TODO map before toArray
    }

    createDataset(dataset: Dataset): Promise<Dataset> {
        return this.db.table("datasets").put({dataset: dataset.name}).then(() => dataset);
    }

    deleteDataset(dataset: Dataset): Promise<Dataset> {
        return this.db.table("datasets").delete(dataset.name).then(() => dataset);
    }

    datasetExists(dataset: Dataset): Promise<boolean> {
        return this.db.table("datasets").get(dataset.name).then(ds => ds !== undefined);
    }

    matchDatasetPrefix(prefix: string): Promise<Array<Dataset>> {
        return this.db.table("datasets").where("dataset").startsWith(prefix).toArray().then(arr => arr.map(val => new Dataset(val))); //TODO map before toArray
    }

    matchDatasetRange(start: string, end: string): Promise<Array<Dataset>> {
        return this.db.table("datasets").where("dataset").between(start, end).toArray().then(arr => arr.map(val => new Dataset(val))); //TODO map before toArray
    }

    query<T>(dataset: Dataset, fn: (readTx: ReadTx) => Promise<T>): Promise<T> {
        return this.db.transaction("r", this.db.table("statements"), tx => {
            let readtx = new LDReadTx(tx, dataset);
            return fn(readtx);
        });
    }

    write<T>(dataset: Dataset, fn: (writeTx: WriteTx) => Promise<T>): Promise<T> {
        return this.db.transaction("rw", this.db.table("statements"), tx => {
            let writetx = new LDWriteTx(tx, dataset);
            return fn(writetx);
        });
    }

    close(deleteDb: boolean = false): Promise<void> {
        if (deleteDb) {
            return this.db.delete()
                .then(() => { this.db.close() })
                .then(() => { this._isOpen = false });
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
