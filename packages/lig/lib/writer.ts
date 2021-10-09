/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Statement, Identifier, LongLiteral } from '@ligature/ligature';
import type { Value } from '@ligature/ligature';
 
export function write(statements: Array<Statement>): string {
    let finalString = "";
    for (let statement of statements) {
        finalString += writeStatement(statement) + "\n";
    }
    return finalString;
}

export function writeIdentifier(identifier: Identifier): string {
    return "<" + identifier.id + ">";
}

export function writeValue(value: Value): string {
    if (value instanceof Identifier) {
        return writeIdentifier(value);
    } else if (typeof value == 'string') {
        return '"' + value + '"'; //TODO needs escapes
    } else if (value instanceof LongLiteral) {
        return value.value.toString();
    } else if (value instanceof Uint8Array) {
        let res = "0x";
        for (let byte of value) {
            let bstr = byte.toString(16);
            if (bstr.length == 1) {
                bstr = "0" + bstr;
            }
            res = res + bstr;
        }
        return res;
    } else {
        throw new Error("Could not write invalid value - " + value);
    }
}

export function writeStatement(statement: Statement): string {
    return writeIdentifier(statement.entity) + " " + writeIdentifier(statement.attribute) +
        " " + writeValue(statement.value) + " " + writeIdentifier(statement.context);
}
