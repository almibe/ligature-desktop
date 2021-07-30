/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Attribute, Entity, Statement } from "@ligature/ligature";
import { Script } from '../lib/ast'

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
                type: 'valueExpression',
                value: new Attribute("attribute")
            }
        ]
    } as Script,

    "boolean.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: true
            }
        ]
    } as Script,
    
    "entity.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: new Entity("test")
            }
        ]
    } as Script,

    "float.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: 3.0
            }
        ]
    } as Script,

    "integer.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: 24601n
            }
        ]
    } as Script,

    "nothing.wander": {
        type: 'script',
        elements: []
    } as Script,

    "statement.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: new Statement(new Entity("entity"), new Attribute("attribute"), 3.03, new Entity("context"))
            }
        ]
    } as Script,

    "string.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: "Hello"
            }
        ]
    } as Script,

    //ASSIGNMENT
    "let.wander": {
        type: 'script',
        elements: [
            {
                type: 'letStatement',
                name: { type: 'identifier', identifier: "x" },
                expression: {
                    type: "valueExpression",
                    value: 5n
                }
            }
        ]
    } as Script,

    "let-res.wander": {
        type: 'script',
        elements: [
            {
                type: 'letStatement',
                name: { type: 'identifer', identifier: "x" },
                expression: {
                    type: "valueExpression",
                    value: 5n
                }
            },
            {
                type: 'referenceExpression',
                name: 'x'
            }
        ]
    } as Script,

    "block.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: "Hello"
            }
        ]
    } as Script,

    "block-shadow.wander": {
        type: 'script',
        elements: [
            {
                type: 'valueExpression',
                value: "Hello"
            }
        ]
    } as Script,
}
