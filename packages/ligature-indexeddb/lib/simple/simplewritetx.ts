/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WriteTx, Statement, Entity, Dataset, Attribute } from "@ligature/ligature";
import type { Value } from "@ligature/ligature";
import { v4 as uuidv4 } from 'uuid';
import { IDBPTransaction } from "idb";

export class SimpleWriteTx implements WriteTx {
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
        let entity = this.createEntity(statement.entity);
        let attribute = this.createAttribute(statement.attribute);
        //TODO look up value (if it is an entity, string, or byte array) and create if missing
        let value = this.createValue(statement.value);
        //TODO look up context, and make sure it does not exist (should it not exist at all or just not be used as a context?) and create if missing
        let context = this.createContext(statement.context);
        //TODO insert all permutations into Statements object store
        if (!this.statementExists(entity, attribute, value.valueType, value.valueValue, context)) {
            this.insertStatement(entity, attribute, value.valueType, value.valueValue, context);
        }
        return Promise.resolve(statement);
        //TODO that's it?
    }

    async removeStatement(statement: Statement): Promise<Statement> {
        let entity = this.lookupEntity(statement.entity);
        if (entity == null) {
            return Promise.resolve(statement);
        }
        let attribute = this.lookupAttribute(statement.attribute);
        if (attribute == null) {
            return Promise.resolve(statement);
        }
        let value = this.lookupValue(statement.value);
        if (value == null) {
            return Promise.resolve(statement);
        }
        let context = this.lookupContext(statement.context);
        if (context == null) {
            return Promise.resolve(statement);
        }
        if (this.statementExists(entity, attribute, value.valueType, value.valueValue, context)) {
            this.deleteStatement(entity, attribute, value.valueType, value.valueValue, context);
        }
        return Promise.resolve(statement);
        // let id = await this.tx.table("statements").where(this.flattenStatement(statement)).first();
        // console.log("xx")
        // console.log(id)
        // return this.tx.table("statements").delete(id.id).then(() => statement);
    }

    cancel() {
        this.tx.abort();
    }

    /**
     * Checks if an Entity already exists and if so returns the ID of the Entity and adds the Dataset ID to the Entity's Dataset array.
     * If the Entity doesn't already exist it inserts it into the entities Object Store and returns the new ID.
     */
    createEntity(entity: Entity): number {
        throw new Error("Implement methods");
    }

    lookupEntity(entity: Entity): number | null {
        throw new Error("Implement methods");
    }

    createAttribute(attribute: Attribute): number {
        throw new Error("Implement methods");
    }

    lookupAttribute(attribute: Attribute): number | null {
        throw new Error("Implement methods");
    }

    createValue(value: Value): { valueType: number, valueValue: number } {
        throw new Error("Implement methods");
    }

    lookupValue(value: Value): { valueType: number, valueValue: number } | null {
        throw new Error("Implement methods");
    }

    createContext(entity: Entity): number {
        throw new Error("Implement methods");
    }

    lookupContext(entity: Entity): number | null {
        throw new Error("Implement methods");
    }

    statementExists(entity: number, attribute: number, valueType: number, valueValue: number, context: number): boolean {
        throw new Error("Implement methods");
    }

    insertStatement(entity: number, attribute: number, valueType: number, valueValue: number, context: number) {
        throw new Error("Implement methods");
    }

    deleteStatement(entity: number, attribute: number, valueType: number, valueValue: number, context: number) {
        throw new Error("Implement methods");
    }
}
