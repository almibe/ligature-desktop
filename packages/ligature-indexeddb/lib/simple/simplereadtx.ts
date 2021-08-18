/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ReadTx, Entity, Attribute, Value, LiteralRange, Statement, Dataset, ArrayResultStream, ResultStream } from "@ligature/ligature";
import { IDBPTransaction } from "idb";
import type { StatementRecord } from './util';
import { BYTES_VALUE_TYPE, decodeInteger, ENTITY_VALUE_TYPE, FLOAT_VALUE_TYPE, INTEGER_VALUE_TYPE, STRING_VALUE_TYPE, encodeInteger } from "../util";

export class SimpleReadTx implements ReadTx {
    private tx: IDBPTransaction;
    private ds: Dataset;
    private dsId: number;

    constructor(tx: IDBPTransaction, ds: Dataset, dsId: number) {
        this.tx = tx;
        this.ds = ds;
        this.dsId = dsId;
    }

    async allStatements(): Promise<ResultStream<Statement>> {
        let idx = this.tx.objectStore('statements').index('dataset');
        let arr = Array<Statement>();
        (await idx.getAll(this.ds.name)).forEach(s => arr.push(this.createStatement(s)));
        return new ArrayResultStream(arr);
    }

    async matchStatements(entity: Entity | null, 
            attribute: Attribute | null, 
            value: Value | LiteralRange | null, 
            context: Entity | null): Promise<ResultStream<Statement>> {
        let entityIds: Set<number> | null = null;
        let attributeIds: Set<number> | null = null;
        let valueIds: Set<number> | null = null;
        let contextId: number | null = null;

        if (entity != null) {
            entityIds = await this.matchEntity(entity.id);
        }
        if (attribute != null) {
            attributeIds = await this.matchAttribute(attribute.name);
        }
        if (value != null) {
            valueIds = await this.matchValue(value);
        }
        if (context != null) {
            contextId = await this.matchContext(context.id);
        }
        let finalIds = this.findIntersection(entityIds, attributeIds, valueIds, contextId);
        let finalStatements = await this.lookupStatements(finalIds);
        return finalStatements;
    }

    createStatement(record: StatementRecord): Statement {
        let entity = new Entity(record.entity);
        let attribute = new Attribute(record.attribute);
        let value = this.createValue(record.valueType, record.valueValue);
        let context = new Entity(record.context);
        return new Statement(entity, attribute, value, context);
    }

    createValue(valueType: number, valueValue: string | bigint | number | Uint8Array): Value {
        if (valueType == ENTITY_VALUE_TYPE && typeof valueValue == 'string') {
            return new Entity(valueValue);
        } else if (valueType == STRING_VALUE_TYPE && typeof valueValue == 'string') {
            return valueValue
        } else if (valueType == INTEGER_VALUE_TYPE && valueValue instanceof Uint8Array) {
            return decodeInteger(valueValue);
        } else if (valueType == FLOAT_VALUE_TYPE && typeof valueValue == 'number') {
            return valueValue;
        } else if (valueType == BYTES_VALUE_TYPE && valueValue instanceof Uint8Array) {
            return valueValue;
        } else {
            throw new Error("Unknown value " + valueType + " - " + valueValue);
        }
    }

    async matchEntity(entity: string): Promise<Set<number>> {
        let keys = await this.tx.objectStore("statements").index("entity").getAllKeys([this.ds.name, entity]);
        return new Set(keys as number[]);
    }

    async matchAttribute(attribute: string): Promise<Set<number>> {
        let keys = await this.tx.objectStore("statements").index("attribute").getAllKeys([this.ds.name, attribute]);
        return new Set(keys as number[]);
    }

    async matchValue(value: Value | LiteralRange): Promise<Set<number>> {
        let query: IDBKeyRange | IDBValidKey
        if (typeof value == "number") {
            query = [this.ds.name, FLOAT_VALUE_TYPE, value];
        } else if (typeof value == "string") {
            query = [this.ds.name, STRING_VALUE_TYPE, value];
        } else if (typeof value == "bigint") {
            query = [this.ds.name, INTEGER_VALUE_TYPE, encodeInteger(value)];
        } else if (value instanceof Entity) {
            query = [this.ds.name, ENTITY_VALUE_TYPE, value.id];
        } else if (value instanceof Uint8Array) {
            query = [this.ds.name, BYTES_VALUE_TYPE, value];
        } else if (typeof value['start'] == 'number' && typeof value['end'] == 'number') {
            query = IDBKeyRange.bound([this.ds.name, FLOAT_VALUE_TYPE, value.start], [this.ds.name, FLOAT_VALUE_TYPE, value.end], false, true);
        } else if (typeof value['start'] == 'string' && typeof value['end'] == 'string') {
            query = IDBKeyRange.bound([this.ds.name, STRING_VALUE_TYPE, value.start], [this.ds.name, STRING_VALUE_TYPE, value.end], false, true);
        } else if (typeof value['start'] == 'bigint' && typeof value['end'] == 'bigint') {
            query = IDBKeyRange.bound([this.ds.name, INTEGER_VALUE_TYPE, encodeInteger(value.start)], [this.ds.name, INTEGER_VALUE_TYPE, encodeInteger(value.end)], false, true);
        } else if (value['start'] instanceof Uint8Array && value['end'] instanceof Uint8Array) {
            query = IDBKeyRange.bound([this.ds.name, BYTES_VALUE_TYPE, value.start], [this.ds.name, BYTES_VALUE_TYPE, value.end], false, true);
        } else {
            throw new Error("Unsupported value in query - " + value);
        }
        let keys = await this.tx.objectStore("statements").index("value").getAllKeys(query);
        return new Set(keys as number[]);
    }

    async matchContext(context: string): Promise<number> {
        let key = await this.tx.objectStore("statements").index("context").getKey([this.ds.name, context]);
        return key as number;
    }

    findIntersection(entityIds: Set<number> | null, attributeIds: Set<number> | null, valueIds: Set<number> | null, contextId: number | null): Set<number> | null {
        let intersect = (first: Set<number> | null, second: Set<number> | null): Set<number> | null => {
            if (first === null) {
                return second;
            } else if (second === null) {
                return first;
            } else {
                let result = new Set<number>();
                for (let id of first) {
                    if (second.has(id)) {
                        result.add(id);
                    }
                }
                return result;
            }
        }

        let t1 = intersect(entityIds, attributeIds);
        let t2 = intersect(t1, valueIds);
        return intersect(t2, contextId == null ? null : new Set([contextId]));
    }

    async lookupStatements(statementIds: Set<number> | null): Promise<ResultStream<Statement>> {
        if (statementIds == null) {
            return this.allStatements();
        } else {
            let arr = Array<Statement>();
            for (let id of statementIds) { //TODO use a cursor for this instead of a loop
                (await this.tx.objectStore("statements").getAll(id)).forEach(s => arr.push(this.createStatement(s)));
            }
            return new ArrayResultStream(arr);
        }
    }
}
