/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ReadTx, Entity, Attribute, Value, LiteralRange, Statement } from "@ligature/ligature";
 
class LDReadTx implements ReadTx {

    constructor() {

    }

    allStatements(): Promise<Array<Statement>> {
        throw new Error("Method not implemented.");
    }
    matchStatements(entity: Entity | null, attribute: Attribute | null, value: Value | LiteralRange | null, context: Entity | null): Promise<Array<Statement>> {
        throw new Error("Method not implemented.");
    }
}
