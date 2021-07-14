/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ReadTx, Entity, Attribute, Value, LiteralRange, Statement, Dataset } from "@ligature/ligature";
import { IDBPTransaction } from "idb";
import type { StatementRecord } from './util';
import { decodeInteger } from "../util";

export class SimpleReadTx implements ReadTx {
    private tx: IDBPTransaction;
    private ds: Dataset;
    private dsId: number;

    constructor(tx: IDBPTransaction, ds: Dataset, dsId: number) {
        this.tx = tx;
        this.ds = ds;
        this.dsId = dsId;
    }

    async allStatements(): Promise<Array<Statement>> {
        let idx = this.tx.objectStore('statements').index('dataset');
        let arr = Array<Statement>();
        (await idx.getAll(this.ds.name)).forEach(s => arr.push(this.createStatement(s)));
        return Promise.resolve(arr);
    }

    async matchStatements(entity: Entity | null, 
            attribute: Attribute | null, 
            value: Value | LiteralRange | null, 
            context: Entity | null): Promise<Array<Statement>> {
        let query: any = {};
        let arr = Array<Statement>();
        if (entity != null) {
            query['entity'] = entity.id;
        }
        if (attribute != null) {
            query['attribute'] = attribute.name;
        }
        //TODO handle values
        if (context != null) {
            query['context'] = context.id;
        }
        return Promise.resolve(arr);
    }

    createStatement(record: StatementRecord): Statement {
        let entity = new Entity(record.entity);
        let attribute = new Attribute(record.attribute);
        let value = this.createValue(record.valueType, record.valueValue);
        let context = new Entity(record.context);
        return new Statement(entity, attribute, value, context);
    }

    createValue(valueType: number, valueValue: string | bigint | number | Uint8Array): Value {
        if (valueType == 0 && typeof valueValue == 'string') {
            return new Entity(valueValue);
        } else if (valueType == 1 && valueValue instanceof Uint8Array) {
            return decodeInteger(valueValue);
        } else if (valueType == 2 && typeof valueValue == 'number') {
            return valueValue;
        } else if (valueType == 3 && typeof valueValue == 'string') {
            return valueValue
        } else if (valueType == 4 && valueValue instanceof Uint8Array) {
            return valueValue;
        } else {
            throw new Error("Unknown value " + valueType + " - " + valueValue);
        }
    }
}
