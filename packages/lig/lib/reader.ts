/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Statement, Entity, Attribute } from "@ligature/ligature";
import type { Value } from '@ligature/ligature';

export function read(input: string): Array<Statement> {
    throw new Error("Not implemented.");
}

export function readStatement(input: string): Statement {
    throw new Error("Not implemented.");
}

export function readEntity(input: string): Entity {
    throw new Error("Not implemented.");
}

export function readAttribute(input: string): Attribute {
    throw new Error("Not implemented.");
}

export function readValue(input: string): Value {
    throw new Error("Not implemented.");
}
