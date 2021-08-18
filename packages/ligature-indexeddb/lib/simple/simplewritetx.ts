/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WriteTx, Statement, Entity, Dataset, Attribute } from "@ligature/ligature";
import type { Value } from "@ligature/ligature";
import { v4 as uuidv4 } from 'uuid';
import { IDBPTransaction } from "idb";
import { encodeInteger, valueType } from '../util';
import type { StatementRecord } from './util';

export class SimpleWriteTx implements WriteTx {
    private tx: IDBPTransaction<unknown, string[], "readwrite">;
    private ds: Dataset;
    private dsId: number;

    constructor(tx: IDBPTransaction<unknown, string[], "readwrite">, ds: Dataset, dsId: number) {
        this.tx = tx;
        this.ds = ds;
        this.dsId = dsId;
    }

    async newEntity(prefix: string = '_:'): Promise<Entity> {
        //TODO assert that Entity doesn't exist, and generate new one if it does
        let entity = new Entity(prefix + uuidv4());
        if (entity.isValid()) {
            return Promise.resolve(entity);
        } else {
            throw new Error("Invalid Entity prefix '" + prefix + "'.");
        }
    }

    async addStatement(statement: Statement): Promise<Statement> {
        let statementRecord = this.createStatementRecord(statement);
        this.tx.objectStore("statements").put(statementRecord);
        return Promise.resolve(statement);
    }

    async removeStatement(statement: Statement): Promise<Statement> {
        let record = this.createStatementRecord(statement)
        let os = this.tx.objectStore("statements");
        let id = await os.index("statement").getKey([
            record.dataset,
            record.entity,
            record.attribute,
            record.valueType,
            record.valueValue,
            record.context
        ]);
        if (id === undefined) {
            return Promise.resolve(statement);
        } else {
            await os.delete(id);
            return Promise.resolve(statement);
        }
    }

    cancel() {
        this.tx.abort();
    }

    createStatementRecord(statement: Statement): StatementRecord {
        return {
            dataset: this.ds.name, //TODO maybe use ID instance of name
            entity: statement.entity.id,
            attribute: statement.attribute.name,
            valueType: valueType(statement.value),
            valueValue: this.valueValue(statement.value),
            context: statement.context.id
        }
    }

    valueValue(value: Value): string | Uint8Array | number {
        if (value instanceof Entity) {
            return value.id
        } else if (typeof value == 'bigint') {
            return encodeInteger(value)
        } else {
            return value;
        }
    }
}
