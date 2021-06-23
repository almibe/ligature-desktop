/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WriteTx, Statement, Entity } from "@ligature/ligature";

class LDWriteTx implements WriteTx {
    generateEntity(prefix: string): Promise<Entity> {
        throw new Error("Method not implemented.");
    }
    addStatement(statement: Statement): Promise<Statement> {
        throw new Error("Method not implemented.");
    }
    removeStatement(statement: Statement): Promise<Statement> {
        throw new Error("Method not implemented.");
    }
    cancel() {
        throw new Error("Method not implemented.");
    }
}
