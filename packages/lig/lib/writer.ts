/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Statement, Entity, Attribute } from '@ligature/ligature';
import type { Value } from '@ligature/ligature';
 
export function write(statements: Array<Statement>): string {
    let finalString = "";
    for (let statement of statements) {
        finalString += writeStatement(statement) + "\n";
    }
    return finalString;
}

export function writeEntity(entity: Entity): string {
    return "<" + entity.id + ">";
}

export function writeAttribute(attribute: Attribute): string {
    return "@<" + attribute.name + ">";
}

export function writeValue(value: Value): string {
    if (value instanceof Entity) {
        return writeEntity(value);
    } else if (typeof value == 'string') {
        return '"' + value + '"'; //TODO needs escapes
    } else if (typeof value == 'bigint') {
        return value.toString();
    } else if (typeof value == 'number') {
        let res = value.toString();
        if (!res.includes(".")) {
            res = res + ".0";
        }
        return res;
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
    return writeEntity(statement.entity) + " " + writeAttribute(statement.attribute) +
        " " + writeValue(statement.value) + " " + writeEntity(statement.context);
}
