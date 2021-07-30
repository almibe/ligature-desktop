/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WanderValue } from "."

export type Script = Readonly<{ type: 'script', elements: Array<Element> }>
export type Element = LetStatement | Expression
export type LetStatement = Readonly<{ type: 'letStatement', name: Identifier, expression: Expression }>
export type Identifier = Readonly<{ type: 'identifier', identifier: string }>
export type Expression = ValueExpression | ReferenceExpression
export type ValueExpression = Readonly<{ type: 'valueExpression', value: WanderValue }>
export type ReferenceExpression = Readonly<{ type: 'referenceExpression', name: string }>

export type WanderError = Readonly<{ type: 'wanderError', message: string }>
