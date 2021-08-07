/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WanderValue } from ".";
import { Identifier, NativeFunction } from "./ast";
import { Binding } from "./binding";

export function stdLib(): Binding {
    const stdLib = new Binding();

    stdLib.bind(new Identifier("not"), new NativeFunction(["bool"], (parameters: WanderValue[]) => {
        let p = parameters[0] as boolean
        return !p
    }));

    return stdLib;
}
