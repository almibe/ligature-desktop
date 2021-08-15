/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from 'chai';
import { WanderInterpreter } from '../lib';
import { Identifier } from '../lib/ast';
import { Binding } from '../lib/binding';

describe('Scoping tests', () => {
    it('run with no scope', () => {
        let wander = new WanderInterpreter();
        let ligature = open
        throw new Error("Not implemented.")
    })

    it('run with instance scope', () => {
        throw new Error("Not implemented.")
    })

    it('run with Dataset read scope', () => {
        throw new Error("Not implemented.")
    })

    it('run with Dataset write scope', () => {
        throw new Error("Not implemented.")
    })
});
