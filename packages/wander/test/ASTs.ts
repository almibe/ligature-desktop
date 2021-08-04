/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Attribute, Entity, Statement } from "@ligature/ligature";
import { WanderValue } from "../lib";
import { Element, Expression, FunctionDefinition, Identifier, LetStatement, ReferenceExpression, Scope, Script, ValueExpression } from '../lib/ast';

let script = (elements: Array<Element>) => new Script(elements);
let valueExpression = (value: WanderValue) => new ValueExpression(value);
let letStatement = (name: Identifier, expression: Expression) => new LetStatement(name, expression);
let identifier = (name: string) => new Identifier(name);
let referenceExpression = (name: Identifier) => new ReferenceExpression(name);
let scope = (elements: Array<Element>) => new Scope(elements);
let functionDefinition = (parameters: Array<string>, body: Array<Element>) => new FunctionDefinition(parameters, body);
let functionCall = (name: Identifier, parameters: Array<string>) => null as unknown as Element; //TODO get rid of null

/**
 * Keys in this structure match the names of test files and the values
 * match the AST for that file.
 */
export const ast: any = {
    //PRIMITIVES
    "attribute.wander": 
        script([
            valueExpression(new Attribute("attribute"))
        ]),

    "boolean.wander":
        script([
            valueExpression(true)
        ]),
    
    "entity.wander":
        script([
            valueExpression(new Entity("test"))
        ]),

    "float.wander":
        script([
            valueExpression(3.0)
        ]),

    "integer.wander":
        script([
            valueExpression(24601n)
        ]),

    "nothing.wander":
        script([]),

    "statement.wander":
        script([
            valueExpression(new Statement(new Entity("entity"), new Attribute("attribute"), 3.03, new Entity("context")))
        ]),

    "string.wander":
        script([
            valueExpression("Hello")
        ]),

    //ASSIGNMENT
    "let.wander":
        script([
            letStatement(identifier("x"), valueExpression(5n))
        ]),

    "let-res.wander":
        script([
            letStatement(identifier("hello"), valueExpression(5n)),
            referenceExpression(identifier("hello"))
        ]),

    "block.wander":
        script([
            scope([
                letStatement(identifier("x"), valueExpression(7n)),
                referenceExpression(identifier('x'))
            ])
        ]),

    "block-shadow.wander":
        script([
            letStatement(identifier("x"), valueExpression(5n)),
            scope([
                letStatement(identifier("x"), valueExpression(7n)),
                referenceExpression(identifier('x'))
            ])
        ]),

    //FUNCTIONS
    "function0-def.wander":
        script([
            letStatement(identifier("f"), functionDefinition([], [valueExpression(5n)])),
            functionCall(identifier("f"), [])
        ])
}
