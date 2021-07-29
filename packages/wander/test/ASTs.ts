/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Attribute, Entity, Statement } from "@ligature/ligature";

/**
 * Keys in this structure match the names of test files and the values
 * match the AST for that file.
 */
export const ast: any = {
    //PRIMITIVES
    "attribute.wander": {
        type: 'script',
        elements: [
            { 
                type: 'expression',
                value: new Attribute("attribute")
            }
        ]
    },

    "boolean.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: true
            }
        ]
    },
    
    "entity.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: new Entity("test")
            }
        ]
    },

    "float.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: 3.0
            }
        ]
    },

    "integer.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: 24601n
            }
        ]
    },

    "nothing.wander": {
        type: 'script',
        elements: []
    },

    "statement.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: new Statement(new Entity("entity"), new Attribute("attribute"), 3.03, new Entity("context"))
            }
        ]
    },

    "string.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: "Hello"
            }
        ]
    },

    //ASSIGNMENT
    "let.wander": {
        type: 'script',
        elements: [
            {
                type: 'letStatement',
                name: "x",
                expression: {
                    type: "expression",
                    value: 5n
                }
            }
        ]
    },

    "let-res.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: "Hello"
            }
        ]
    },

    "block.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: "Hello"
            }
        ]
    },

    "block-shadow.wander": {
        type: 'script',
        elements: [
            {
                type: 'expression',
                value: "Hello"
            }
        ]
    },
}
