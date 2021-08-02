/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { WanderValue } from "."

export interface Ast {
    eval<T>(): T
}

export class Script implements Ast {
    readonly elements: Array<Element>

    constructor(elements: Array<Element>) {
        this.elements = elements;
    }

    eval<T>(): T {
        throw new Error("Not implemented.");
    }
}

export class Scope implements Expression {
    readonly elements: Array<Element>

    constructor(elements: Array<Element>) {
        this.elements = elements;
    }

    eval<T>(): T {
        throw new Error("Not implemented.");
    }
}

interface Element extends Ast {}

export class LetStatement implements Element {
    readonly name: Identifier
    readonly expression: Expression

    constructor(name: Identifier, expression: Expression) {
        this.name = name;
        this.expression = expression;
    }

    eval<T>(): T {
        throw new Error("Not implemented.");
    }
}

export class Identifier implements Ast {
    readonly identifier: Identifier

    constructor(identifier: Identifier) {
        this.identifier = identifier;
    }

    eval<T>(): T {
        throw new Error("Not implemented.");
    }
}

interface Expression extends Element {}

export class ValueExpression implements Expression {
    readonly value: WanderValue

    constructor(value: WanderValue) {
        this.value = value;
    }

    eval<T>(): T {
        throw new Error("Not implemented.");
    }
}

export class ReferenceExpression implements Expression {
    readonly name: Identifier

    constructor(name: Identifier) {
        this.name = name;
    }

    eval<T>(): T {
        throw new Error("Not implemented.");
    }
}

export class WanderError {
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}
