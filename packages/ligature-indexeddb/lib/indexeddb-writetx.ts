/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WriteTx, Statement } from "@ligature/ligature";

class IndexeddbLigatureWriteTx implements WriteTx {
    generateEntity(prefix: string): string {
        throw new Error("Method not implemented.");
    }
    addStatement(statement: Statement) {
        throw new Error("Method not implemented.");
    }
    removeStatement(statement: Statement) {
        throw new Error("Method not implemented.");
    }
    cancel() {
        throw new Error("Method not implemented.");
    }
}
