/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { readdirSync, readFileSync } from 'fs';
import { WanderInterpreter } from '../lib/index';

describe('Wander tests', () => {
    const wander = new WanderInterpreter();    
    readdirSync(__dirname + "/resources").forEach(dir => {
        if (dir !== "old") {
            readdirSync(__dirname + "/resources/" + dir).forEach(testFile => {
                if (testFile.endsWith("wander")) {
                    test(testFile, () => {
                        const script = readFileSync(__dirname + "/resources/" + dir + "/" + testFile);
                        const expected = readFileSync(__dirname + "/resources/" + dir + "/" + testFile.replace(/\.wander$/, ".result"));
                        const result = wander.run(script.toString());
                        expect(result).toMatch(expected.toString());
                    })
                }
            });
        }
    });
});
