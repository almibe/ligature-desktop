/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Observable } from "rxjs";
import { Ligature, ReadTx, WriteTx } from "@ligature/ligature";

class InMemoryLigature implements Ligature {
    allDatasets(): Observable<string> {
        throw new Error("Method not implemented.");
    }
    datasetExists(dataset: string): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    matchDatasetPrefix(prefix: string): Observable<string> {
        throw new Error("Method not implemented.");
    }
    matchDatasetRange(start: string, end: string): Observable<string> {
        throw new Error("Method not implemented.");
    }
    createDataset(dataset: string): Observable<string> {
        throw new Error("Method not implemented.");
    }
    deleteDataset(dataset: string): Observable<string> {
        throw new Error("Method not implemented.");
    }
    query<T>(fn: (readTx: ReadTx) => T): T {
        throw new Error("Method not implemented.");
    }
    write<T>(fn: (writeTx: WriteTx) => T): T {
        throw new Error("Method not implemented.");
    }
    close(): void {
        throw new Error("Method not implemented.");
    }
    isOpen(): boolean {
        throw new Error("Method not implemented.");
    }
}
