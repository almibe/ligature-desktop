/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WanderValue } from ".";
import { Name } from "./ast";

export class Binding {
    private scopes: Array<Map<string, WanderValue>>;

    constructor() {
        this.scopes = new Array();
        this.scopes.push(new Map());
    }

    addScope() {
        this.scopes.push(new Map());
    }

    removeScope() {
        if (this.scopes.length <= 1) {
            throw new Error("Can not remove scope.");
        }
        this.scopes.pop();
    }

    bind(name: Name, wanderValue: WanderValue) {
        let key = name.name
        let currentScope = this.scopes[this.scopes.length-1];
        if (currentScope.has(key)) {
            throw new Error(`${key} is already bound in current scope.`);
        } else {
            currentScope.set(key, wanderValue);
        }
    }

    read(name: Name): WanderValue {
        let currentScopeOffset = this.scopes.length-1;
        let key = name.name;
        while (currentScopeOffset >= 0) {
            let currentScope = this.scopes[currentScopeOffset];
            let value = currentScope.get(key);
            if (value != undefined) {
                return value;
            }
            currentScopeOffset -= 1;
        }
        throw new Error(`Could not find ${key} in scope.`);
    }
}
