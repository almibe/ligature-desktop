/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Observable, of } from "rxjs";
import { Ligature, ReadTx, WriteTx, Dataset } from "@ligature/ligature";
import { Dexie } from "dexie";

export class InMemoryLigature implements Ligature {
    private db = new Dexie('test'); //TODO name shouldn't be test, maybe pass as a param to constructor?
    private datasets: Set<string> = new Set(); //TODO replace with dexie db
    private _isOpen = true;

    constructor() {
        console.log("start");
        this.db.version(1).stores({foo: 'id'});

        this.db.table("foo").put({id: 1, bar: 'hello rollup'}).then(id => {
            return this.db.table("foo").get(id);
        }).then (item => {
            console.info("Found: " + item.bar);
        }).catch (err => {
            console.error("Error: " + (err.stack || err));
        });
        console.log("end");
    }

    allDatasets(): Observable<Dataset> {
        return new Observable(subscriber => {
            this.datasets.forEach((ds) => {
                subscriber.next(ds);
            })
            subscriber.complete();
        });
    }

    createDataset(dataset: Dataset): Observable<Dataset> {
        this.datasets.add(dataset);
        return of(dataset);
    }

    deleteDataset(dataset: Dataset): Observable<Dataset> {
        this.datasets.delete(dataset);
        return of(dataset);
    }

    datasetExists(dataset: Dataset): Observable<boolean> {
        return of(this.datasets.has(dataset))
    }

    matchDatasetPrefix(prefix: Dataset): Observable<Dataset> {
        throw new Error("Method not implemented.");
    }
    matchDatasetRange(start: Dataset, end: Dataset): Observable<Dataset> {
        throw new Error("Method not implemented.");
    }
    query<T>(fn: (readTx: ReadTx) => T): T {
        throw new Error("Method not implemented.");
    }
    write<T>(fn: (writeTx: WriteTx) => T): T {
        throw new Error("Method not implemented.");
    }
    close(): void {
        this.datasets.clear();
        this._isOpen = false;
    }
    isOpen(): boolean {
        return this._isOpen
    }
}
