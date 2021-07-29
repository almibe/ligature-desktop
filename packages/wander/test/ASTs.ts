/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Attribute, Entity } from "@ligature/ligature";

/**
 * Keys in this structure match the names of test files and the values
 * match the AST for that file.
 */
export const ast: any = {
    "attribute.wander": {
        elements: [
            { 
                value: new Attribute("attribute")
            }
        ]
    },

    "boolean.wander": {
        elements: [
            { 
                value: true
            }
        ]
    },
    
    "entity.wander": {
        elements: [
            { 
                value: new Entity("test")
            }
        ]
    },

    "float.wander": {
        elements: [
            { 
                value: 3.0
            }
        ]
    },

    "integer.wander": {
        elements: [
            { 
                value: 24601n
            }
        ]
    },

    "nothing.wander": {
        elements: [
            { 
                value: null //TODO this probably shouldn't be null???
            }
        ]
    },

    "statement.wander": {
        elements: [
            { 
                value: null //TODO need to figure out how I want to encode this
            }
        ]
    },

    "string.wander": {
        elements: [
            { 
                value: "Hello"
            }
        ]
    },
}
