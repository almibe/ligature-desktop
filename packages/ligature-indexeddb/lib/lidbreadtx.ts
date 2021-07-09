/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ReadTx, Entity, Attribute, Value, LiteralRange, Statement, Dataset } from "@ligature/ligature";
import { IDBPTransaction } from "idb";

export class LIDBReadTx implements ReadTx {
    private tx: IDBPTransaction;
    private ds: Dataset;

    constructor(tx: IDBPTransaction, ds: Dataset) {
        this.tx = tx;
        this.ds = ds;
    }

    async allStatements(): Promise<Array<Statement>> {
        throw new Error("Not Implemented.");
        // return (await this.tx.table("statements").toArray()).map(res => {
        //     return this.makeStatement(res)
        // });
    }

    async matchStatements(entity: Entity | null, 
            attribute: Attribute | null, 
            value: Value | LiteralRange | null, 
            context: Entity | null): Promise<Array<Statement>> {
        throw new Error("Not Implemented.");
        // let query: any = {};
        // if (entity != null) {
        //     query['entity'] = entity.id;
        // }
        // if (attribute != null) {
        //     query['attribute'] = attribute.name;
        // }
        // //TODO handle values
        // if (context != null) {
        //     query['context'] = context.id;
        // }
        // console.log("query")
        // console.log(query);
        // return (await (this.tx.table("statements").where(query) as unknown as Collection).toArray()).map(res => {
        //     return this.makeStatement(res);
        // });
    }

    private makeStatement(input: any): Statement {
        let entity = new Entity(input.entity);
        let attribute = new Attribute(input.attribute);
        let value: Value;
        if (input.valueType == 'entity') {
            value = new Entity(input.value);
        } else {
            value = input.value;
        }
        let context = new Entity(input.context);
        return new Statement(entity, attribute, value, context);
    }
}
