/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Ligature, ReadTx, WriteTx, Dataset } from "@ligature/ligature";
import { Dexie } from "dexie";

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
        return this.db.table("datasets").toArray();
    }

    createDataset(dataset: Dataset): Promise<Dataset> {
        return this.db.table("datasets").put({dataset}).then(() => dataset);
    }

    deleteDataset(dataset: Dataset): Promise<Dataset> {
        return this.db.table("datasets").delete(dataset).then(() => dataset);
    }

    datasetExists(dataset: Dataset): Promise<boolean> {
        return this.db.table("datasets").get({dataset}).then(ds => ds !== undefined);
    }

    matchDatasetPrefix(prefix: Dataset): Promise<Array<Dataset>> {
        throw new Error("Method not implemented.");
    }

    matchDatasetRange(start: Dataset, end: Dataset): Promise<Array<Dataset>> {
        throw new Error("Method not implemented.");
    }

    query<T>(fn: (readTx: ReadTx) => T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    write<T>(fn: (writeTx: WriteTx) => T): Promise<T> {
        throw new Error("Method not implemented.");
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
