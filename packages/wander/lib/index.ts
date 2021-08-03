/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { identifierPattern } from '@ligature/ligature';
import { createToken, CstNode, CstParser, Lexer } from 'chevrotain';
import { writeValue,
    writeEntity,
    writeAttribute,
    writeStatement,
    processValue,
} from '@ligature/lig';
import { Value, Entity, Attribute, Statement } from '@ligature/ligature';
import { LetStatement, Script, Element, Expression, Identifier, ValueExpression, WanderError, Scope, ReferenceExpression } from './ast';
import { debug } from './debug';
import { Binding } from './binding';

//Tokens that are shared with lig
//TODO all of these tokens should use a shared pattern with @ligature/lig, I don't think I can share the actual tokens though
const WHITE_SPACE_T = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const ANGLE_START_T = createToken({name: "AngleStart", pattern: /</});
const ATTRIBUTE_START_T = createToken({name: "AttributeStart", pattern: /@</});
const ANGLE_END_T = createToken({name: "AngleEnd", pattern: />/});
const IDENTIFIER_T = createToken({name: "Identifier", pattern: identifierPattern});
const STRING_T = createToken({name: "String", pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/});
const FLOAT_T = createToken({name: "Float", pattern: /[0-9]+\.[0-9]+/}); //TODO fix pattern to not allow leading zeros
const INTEGER_T = createToken({name: "Integer", pattern: /[0-9]+/}); //TODO fix pattern to not allow leading zeros
const BYTES_T = createToken({name: "Bytes", pattern: /0x(:?[0-9A-Fa-f]{2})+/});

//Tokens that are unique to Wander
const COMMENT_NEW_LINE_T = createToken({ name: "Comment", pattern: /#.*\n/, group: Lexer.SKIPPED });
const COMMENT_END_T = createToken({ name: "Comment", pattern: /#.*/, group: Lexer.SKIPPED });
const NOTHING_T = createToken({ name: "Nothing", pattern: /nothing/ }); //TODO update so it doesn't match longer string
const LET_T = createToken({ name: "Let", pattern: /let/ }); //TODO update so letter doesn't match (see chevrotain docs)
const EQUALS_T = createToken({ name: "Equals", pattern: /=/ });
const BOOLEAN_T = createToken({ name: "Boolean", pattern: /(true)|(false)/ }); //TODO update so it doesn't match longer string
const WHEN_T = createToken({ name: "when", pattern: /when/ }); //TODO update so it doesn't match longer string
const BRACE_LEFT_T = createToken({ name: "braceLeft", pattern: /\{/ });
const BRACE_RIGHT_T = createToken({ name: "braceRight", pattern: /\}/ });
const PAREN_LEFT_T = createToken({ name: "parenLeft", pattern: /\(/ });
const PAREN_RIGHT_T = createToken({ name: "parenRight", pattern: /\)/ });
const ARROW_T = createToken({ name:'arrow', pattern: /->/ });
const DOT_T = createToken({ name: "dot", pattern: /\./ });

const allTokens = [
    COMMENT_NEW_LINE_T,
    WHITE_SPACE_T,
    LET_T,
    BOOLEAN_T,
    NOTHING_T,
    DOT_T,
    WHEN_T,
    PAREN_LEFT_T,
    PAREN_RIGHT_T,
    ARROW_T,
    BRACE_LEFT_T,
    BRACE_RIGHT_T,
    EQUALS_T,
    ANGLE_START_T,
    ATTRIBUTE_START_T,
    ANGLE_END_T,
    IDENTIFIER_T,
    STRING_T,
    BYTES_T,
    FLOAT_T,
    INTEGER_T,
    COMMENT_END_T
];

class WanderParser extends CstParser {
    constructor() {
        super(allTokens, {maxLookahead: 4});

        const $ = this;

        $.RULE('script', () => {
            $.MANY(() => {
                $.SUBRULE($.topLevel);
            });
        });

        $.RULE('topLevel', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.letStatement) },
                { ALT: () => $.SUBRULE($.expression) }
            ]);
        });

        $.RULE('letStatement', () => {
            $.CONSUME(LET_T);
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(EQUALS_T);
            $.SUBRULE($.expression);
        });

        $.RULE('expression', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.wanderValue) },
                { ALT: () => $.SUBRULE($.whenExpression) },
                { ALT: () => $.SUBRULE($.functionCall) },
                { ALT: () => $.SUBRULE($.methodCall) },
                { ALT: () => $.SUBRULE($.scope)},
                { ALT: () => $.CONSUME(IDENTIFIER_T)}
            ])
        });

        $.RULE('wanderValue', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.statement) },
                { ALT: () => $.SUBRULE($.value) },
                { ALT: () => $.SUBRULE($.attribute) },
                { ALT: () => $.SUBRULE($.functionDefinition) },
                { ALT: () => $.CONSUME(BOOLEAN_T) }
            ])
        });

        $.RULE('functionDefinition', () => {
            $.CONSUME(PAREN_LEFT_T);
            //TODO
        })

        $.RULE('whenExpression', () => {
            $.CONSUME(WHEN_T);
            //TODO
        });

        $.RULE('functionCall', () => {
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(PAREN_LEFT_T);
            //TODO
        });

        $.RULE('methodCall', () => {
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(DOT_T);
            //TODO
        });

        $.RULE('scope', () => {
            $.CONSUME(BRACE_LEFT_T);
            $.MANY(() => {
                $.SUBRULE($.topLevel);
            });
            $.CONSUME(BRACE_RIGHT_T);
        });

        $.RULE("statements", () => {
            $.MANY(() => {
                $.SUBRULE($.statement);
            });
        });

        $.RULE("statement", () => {
            $.SUBRULE($.entity);
            $.SUBRULE($.attribute);
            $.SUBRULE($.value);
            $.SUBRULE2($.entity);
        });

        $.RULE("entity", () => {
            $.CONSUME(ANGLE_START_T);
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(ANGLE_END_T);
        });

        $.RULE("attribute", () => {
            $.CONSUME(ATTRIBUTE_START_T);
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(ANGLE_END_T);
        });

        $.RULE("value", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.entity) },
                { ALT: () => $.CONSUME(STRING_T) },
                { ALT: () => $.CONSUME(FLOAT_T) },
                { ALT: () => $.CONSUME(INTEGER_T) },
                { ALT: () => $.CONSUME(BYTES_T) }
            ])
        });

        this.performSelfAnalysis();
    }

    //properties below just exist to make TS happy
    script: any;
    topLevel: any;
    expression: any;
    wanderValue: any;
    functionCall: any;
    functionDefinition: any;
    methodCall: any;
    scope: any;
    whenExpression: any;
    entity: any;
    attribute: any;
    value: any;
    statement: any;
    statements: any;
    letStatement: any;
}

const wanderLexer = new Lexer(allTokens);
const wanderParser = new WanderParser();
const BaseWanderVisitor = wanderParser.getBaseCstVisitorConstructor();

type nothing = null;
const nothing = null;

//NOTE: keeping the following two types separate for now since I'm not sure if they will always be the same
export type WanderValue = Value | boolean | Attribute | Statement | nothing;
export type WanderResult = WanderValue;

/**
 * A visitor for Wander that focuses on converting Chevrotain's CTS to an internal AST.
 */
class WanderVisitor extends BaseWanderVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    script(ctx: any): Script {
        let elements = Array<Element>();
        if (ctx.topLevel != undefined) {
            for (let ts of ctx.topLevel) {
                elements.push(this.topLevel(ts.children));
            }
        }
        return new Script(elements);
    }

    topLevel(ctx: any): Element {
        if (ctx.expression != undefined) {
            return this.visit(ctx.expression);
        } else if (ctx.letStatement != undefined) {
            return this.visit(ctx.letStatement);
        } else {
            throw new Error("Not implemented.");
        }
    }

    letStatement(ctx: any): LetStatement {
        const identifier: string = ctx.Identifier[0].image;
        const expression = this.expression(ctx.expression[0].children);
        return new LetStatement(new Identifier(identifier), expression);
    }

    expression(ctx: any): Expression {
        if (ctx.wanderValue != undefined) {
            return new ValueExpression(this.visit(ctx.wanderValue));
        } else if (ctx.Identifier != undefined) {
            return new ReferenceExpression(new Identifier(ctx.Identifier[0].image));
        } else if (ctx.scope != undefined) {
            //debug("scope", ctx.scope)
            return this.scope(ctx.scope[0])
        } else {
            throw new Error("Not implemented.");
        }
    }

    wanderValue(ctx: any): WanderValue {
        if (ctx.Boolean != undefined) {
            return ctx.Boolean[0].image === "true";
        } else if (ctx.value != undefined) {
            if (ctx.value[0].children.Integer != undefined) {
                return BigInt(ctx.value[0].children.Integer[0].image);
            } else if (ctx.value[0].children.Float != undefined) {
                return Number(ctx.value[0].children.Float[0].image);
            } else if (ctx.value[0].children.String != undefined) {
                const stringValue = ctx.value[0].children.String[0].image;
                return stringValue.substring(1,stringValue.length-1);
            } else if (ctx.value[0].children.entity != undefined) {
                return new Entity(ctx.value[0].children.entity[0].children.Identifier[0].image);
            } else {
                throw new Error("Unsupported Wander Value - " + ctx.value[0].children);
            }
        } else if (ctx.attribute != undefined) {
            return new Attribute(ctx.attribute[0].children.Identifier[0].image);
        } else if (ctx.statement != undefined) {
            const entity = new Entity(ctx.statement[0].children.entity[0].children.Identifier[0].image);
            const attribute = new Attribute(ctx.statement[0].children.attribute[0].children.Identifier[0].image);
            const value = processValue(ctx.statement[0].children.value[0]);
            const context = new Entity(ctx.statement[0].children.entity[1].children.Identifier[0].image);
            return new Statement(entity, attribute, value, context);
        } else {
            throw new Error("Not implemented.");
        }
    }

    functionDefinition(ctx: any) {
        throw new Error("Not implemented.");
    }

    whenExpression(ctx: any) {
        throw new Error("Not implemented.");
    }

    functionCall(ctx: any) {
        throw new Error("Not implemented.");
    }

    methodCall(ctx: any) {
        throw new Error("Not implemented.");
    }

    scope(ctx: any): Scope {
        let elements = new Array<Element>();
        if (ctx.children.topLevel != undefined) {
            for (let ts of ctx.children.topLevel) {
                elements.push(this.topLevel(ts.children));
            }
        }
        return new Scope(elements);
    }

    statements(ctx: any) {
        throw new Error("Not implemented.");
    }

    statement(ctx: any) {
        throw new Error("Not implemented.");
    }

    entity(ctx: any) {
        throw new Error("Not implemented.");
    }

    attribute(ctx: any) {
        throw new Error("Not implemented.");
    }

    value(ctx: any) {
        throw new Error("Not implemented.");
    }
}

const wanderVisitor = new WanderVisitor();

export class WanderInterpreter {
    run(script: string): WanderResult | WanderError {
        const res = this.createAst(script);
        if (res instanceof WanderError) {
            return res;
        } else {
            return this.eval(res);
        }
    }

    createAst(script: string): Script | WanderError  {
        const lexResult = wanderLexer.tokenize(script);
        if (lexResult.errors.length > 0) {
            return new WanderError(`Lexing Error: ${lexResult.errors}`); //TODO make message better/multiple messages?
        }
        
        wanderParser.input = lexResult.tokens;
        let parseResult = wanderParser.script()
        if (wanderParser.errors.length > 0) {
            return new WanderError(`Parsing Error: ${wanderParser.errors}`) //TODO make message better/multiple messages?
        }

        const res = wanderVisitor.visit(parseResult);
        return res;
    }

    eval(script: Script): WanderResult | WanderError {
        //return script.eval();
        throw new Error("Not implemented.")
    }

    //TODO move this code to ast.ts
    // eval(script: Script): WanderResult | WanderError  {
    //     let result: WanderResult = nothing;
    //     let bindings = new Binding();
    //     for (const element of script.elements) {
    //         if (element.type == "valueExpression") {
    //             result = element.value;
    //         } else if (element.type == "letStatement") {
    //             if (element.expression.type == "valueExpression") {
    //                 bindings.bind(element.name, element.expression.value);
    //             } else {
    //                 throw new Error("Not implemented.");
    //             }
    //         } else if (element.type == "referenceExpression") {
    //             result = bindings.read(element.name)
    //         } else {
    //             throw new Error(`Element type ${element} not implemented`);
    //         }
    //     }
    //     return result;
    //}
}

/**
 * Writes a given WanderResult as a string, referring to the lig implementation of write functions when applicable.
 * @param result A WanderResult.
 * @returns The serialized (not just toStringed) version of that WanderResult.
 */
export function write(result: WanderResult | WanderError): string {
    if (typeof result == "number") {
        return writeValue(result);
    } else if (typeof result == "string") {
        return writeValue(result);
    } else if (result instanceof Entity) {
        return writeEntity(result);
    } else if (result instanceof Attribute) {
        return writeAttribute(result);
    } else if (typeof result == "bigint") {
        return writeValue(result);
    } else if (typeof result == "boolean") {
        return result.toString();
    } else if (result instanceof Statement) {
        return writeStatement(result);
    } else if (result == nothing) {
        return "nothing";
    } else if (result instanceof WanderError) {
        return result.message;
    } else {
        throw new Error("Not implemented.");
    }
}
