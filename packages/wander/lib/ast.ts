/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { nothing, WanderResult, WanderValue } from "."
import { Binding } from "./binding";

export type Result = WanderResult | WanderError

export interface Ast {
    eval(bindings: Binding): Result
}

export class Script implements Ast {
    readonly elements: Array<Element>

    constructor(elements: Array<Element>) {
        this.elements = elements;
    }

    eval(bindings: Binding): Result {
        let result: Result = nothing;
        for (const element of this.elements) {
            result = element.eval(bindings);
        }
        return result;
    }
}

export class Scope implements Expression {
    readonly elements: Array<Element>

    constructor(elements: Array<Element>) {
        this.elements = elements;
    }

    eval(bindings: Binding): Result {
        let result: Result = nothing;
        bindings.addScope();
        for (const element of this.elements) {
            result = element.eval(bindings);
        }
        bindings.removeScope();
        return result;
    }
}

export interface Element extends Ast {}

export class LetStatement implements Element {
    readonly name: Identifier
    readonly expression: Expression

    constructor(name: Identifier, expression: Expression) {
        this.name = name;
        this.expression = expression;
    }

    eval(bindings: Binding): Result {
        if (this.expression instanceof ValueExpression) {
            bindings.bind(this.name, this.expression.value);
        } else {
            throw new Error("Not implemented.");
        }
        return nothing;
    }
}

export class Identifier implements Ast {
    readonly identifier: string

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    eval(bindings: Binding): Result {
        return bindings.read(this);
    }
}

export interface Expression extends Element {}

export class ValueExpression implements Expression {
    readonly value: WanderValue

    constructor(value: WanderValue) {
        this.value = value;
    }

    eval(): Result {
        return this.value;
    }
}

export class ReferenceExpression implements Expression {
    readonly name: Identifier

    constructor(name: Identifier) {
        this.name = name;
    }

    eval(bindings: Binding): Result {
        return bindings.read(this.name);
    }
}

export class WanderError {
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}
