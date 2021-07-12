/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WriteTx, Statement, Entity, Dataset } from "@ligature/ligature";
import { v4 as uuidv4 } from 'uuid';
import { IDBPTransaction } from "idb";

export class LIDBWriteTx implements WriteTx {
    private tx: IDBPTransaction<unknown, string[], "readwrite">;
    private ds: Dataset;
    private dsId: number;

    constructor(tx: IDBPTransaction<unknown, string[], "readwrite">, ds: Dataset, dsId: number) {
        this.tx = tx;
        this.ds = ds;
        this.dsId = dsId;
    }

    async generateEntity(prefix: string = '_:'): Promise<Entity> {
        //TODO assert that Entity doesn't exist, and generate new one if it does
        let entity = new Entity(prefix + uuidv4());
        if (entity.isValid()) {
            return Promise.resolve(entity);
        } else {
            throw new Error("Invalid Entity prefix '" + prefix + "'.");
        }
    }

    async addStatement(statement: Statement): Promise<Statement> {
        throw new Error("Not Implemented.");
        //return this.tx.table("statements").add(this.flattenStatement(statement));
    }

    async removeStatement(statement: Statement): Promise<Statement> {
        throw new Error("Not Implemented.");
        // let id = await this.tx.table("statements").where(this.flattenStatement(statement)).first();
        // console.log("xx")
        // console.log(id)
        // return this.tx.table("statements").delete(id.id).then(() => statement);
    }

    cancel() {
        this.tx.abort();
    }
}
