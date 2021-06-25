/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WriteTx, Statement, Entity, Dataset } from "@ligature/ligature";
import { Transaction } from "dexie";
import { v4 as uuidv4 } from 'uuid';

export class LDWriteTx implements WriteTx {
    private tx: Transaction;
    private ds: Dataset;

    constructor(tx: Transaction, ds: Dataset) {
        this.tx = tx;
        this.ds = ds;
    }

    generateEntity(prefix: string): Promise<Entity> {
        //TODO assert that Entity doesn't exist
        return Promise.resolve(new Entity(prefix + uuidv4()))
    }

    addStatement(statement: Statement): Promise<Statement> {
        return this.tx.table("statements").add(statement);//.then(() => statement);
    }

    removeStatement(statement: Statement): Promise<Statement> {
        return this.tx.table("statements").delete(statement).then(() => statement);
    }

    cancel() {
        throw new Error("Method not implemented.");
    }
}
