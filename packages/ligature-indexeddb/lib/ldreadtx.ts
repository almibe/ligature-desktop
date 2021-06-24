/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ReadTx, Entity, Attribute, Value, LiteralRange, Statement, Dataset } from "@ligature/ligature";
import { Transaction } from "dexie";
 
export class LDReadTx implements ReadTx {
    private tx: Transaction;
    private ds: Dataset;

    constructor(tx: Transaction, ds: Dataset) {
        this.tx = tx;
        this.ds = ds;
    }

    allStatements(): Promise<Array<Statement>> {
        return Promise.resolve(new Array());
    }

    matchStatements(entity: Entity | null, 
            attribute: Attribute | null, 
            value: Value | LiteralRange | null, 
            context: Entity | null): Promise<Array<Statement>> {
        return Promise.resolve(new Array());
    }
}
