/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Identifier, NativeFunction } from "./ast";
import { Binding } from "./binding";
import { TODO } from "./debug";
import { ExecutionScope } from "./index"

export function stdLib(scope: ExecutionScope): Binding {
    let stdLib = common();

    if (scope.scopeType == "Instance") {
        instanceScope(scope, stdLib)
    } else if (scope.scopeType == "ReadTx") {
        readScope(scope, stdLib)
    } else if (scope.scopeType == "WriteTx") {
        writeScope(scope, stdLib)
    }

    return stdLib;
}

function common(): Binding {
    const stdLib = new Binding();

    stdLib.bind(new Identifier("not"), new NativeFunction(["bool"], (bindings: Binding) => {
        let b = bindings.read(new Identifier("bool")) as boolean //TODO check value
        return !b
    }));

    stdLib.bind(new Identifier("and"), new NativeFunction(["booll", "boolr"], (bindings: Binding) => {
        let booll = bindings.read(new Identifier("booll")) as boolean //TODO check value
        let boolr = bindings.read(new Identifier("boolr")) as boolean //TODO check value
        return booll && boolr
    }));

    stdLib.bind(new Identifier("or"), new NativeFunction(["booll", "boolr"], (bindings: Binding) => {
        let booll = bindings.read(new Identifier("booll")) as boolean //TODO check value
        let boolr = bindings.read(new Identifier("boolr")) as boolean //TODO check value
        return booll || boolr
    }));

    return stdLib;
}

function instanceScope(scope: ExecutionScope, bindings: Binding) {
    TODO("Support Instance Scope")
}

function readScope(scope: ExecutionScope, bindings: Binding) {
    TODO("Support ReadTx Scope")
}

function writeScope(scope: ExecutionScope, bindings: Binding) {
    TODO("Support WriteTx Scope")
}
