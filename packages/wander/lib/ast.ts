/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { nothing, WanderResult, WanderValue } from "."
import { Binding } from "./binding";
import { debug, TODO } from "./debug";

export type Result = WanderResult | WanderError

export class FunctionDefinition {
    readonly parameters: Array<string> //this needs types so eventually it'll have to be something other than a string
    readonly body: Array<Element>

    constructor(parameters: Array<string>, body: Array<Element>) {
        this.parameters = parameters;
        this.body = body;
    }
}

export class NativeFunction {
    readonly parameters: Array<string> //this needs types so eventually it'll have to be something other than a string
    readonly body: (bindings: Binding) => WanderResult

    constructor(parameters: Array<string>, body: (bindings: Binding) => WanderResult) {
        this.parameters = parameters;
        this.body = body;
    }
}

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
        let result = this.expression.eval(bindings);
        if (result instanceof WanderError) {
            return result
        } else {
            bindings.bind(this.name, result);
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

export class IfExpression implements Expression {
    readonly condition: Expression
    readonly body: Expression
    readonly elseIfs: Array<ElseIf>
    readonly else: Else | null

    constructor(condition: Expression, body: Expression, elseIfs: Array<ElseIf> = [], elseArg: Else | null = null) {
        this.condition = condition
        this.body = body
        this.elseIfs = elseIfs
        this.else = elseArg
    }

    eval(bindings: Binding): Result {
        let conditionResult = this.condition.eval(bindings);
        if (typeof conditionResult != 'boolean') {
            return new WanderError("Conditions must evaluate to boolean values.")
        }
        if (conditionResult) {
            return this.body.eval(bindings)
        } else {
            for (let elseIf of this.elseIfs) {
                let conditionResult = elseIf.condition.eval(bindings)
                if (typeof conditionResult != 'boolean') {
                    return new WanderError("Conditions must evaluate to boolean values.")
                }
                if (conditionResult) {
                    return elseIf.body.eval(bindings)
                }
            }
            if (this.else != null) {
                return this.else.body.eval(bindings)
            } else {
                return nothing
            }
        }
    }
}

export class ElseIf {
    readonly condition: Expression
    readonly body: Expression

    constructor(condition: Expression, body: Expression) {
        this.condition = condition
        this.body = body
    }
}

export class Else {
    readonly body: Expression

    constructor(body: Expression) {
        this.body = body
    }
}

export class FunctionCall implements Expression {
    readonly name: Identifier;
    readonly parameters: Array<Expression>;

    constructor(name: Identifier, parameters: Array<Expression>) {
        this.name = name;
        this.parameters = parameters;
    }

    createBindings(func: FunctionDefinition | NativeFunction, bindings: Binding): Binding | WanderError {
        if (func.parameters.length == this.parameters.length) {

            let functionBindings = new Binding();

            for (let i = 0; i < func.parameters.length; i++) {
                let result = this.parameters[i].eval(bindings)
                if (result instanceof WanderError) {
                    return result;
                } else {
                    functionBindings.bind(new Identifier(func.parameters[i]), result);
                }
            }
            return functionBindings;
        } else {
            throw new Error(`Invalid number of parameters passed to ${this.name.identifier} expected ${func.parameters.length} received ${this.parameters.length}.`)
        }
    }

    eval(bindings: Binding): Result {
        let func = bindings.read(this.name);
        if (func != undefined && func instanceof FunctionDefinition) {            
            let functionBindings = this.createBindings(func, bindings);
            if (functionBindings instanceof WanderError) {
                return functionBindings;
            }
            let result: Result = nothing;
            for (const element of func.body) {
                result = element.eval(functionBindings);
            }
            return result;        
        } else if (func != undefined && func instanceof NativeFunction) {
            let functionBindings = this.createBindings(func, bindings);
            if (functionBindings instanceof WanderError) {
                return functionBindings;
            }
            let result = func.body(functionBindings);
            return result;
        } else {
            throw new Error(`Function ${this.name.identifier} not found in scope.`);
        }
    }
}

export class WanderError {
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}
