/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { identifierPattern, instanceOfResultStream, Ligature, ReadTx, ResultComplete, ResultError, ResultStream, WriteTx } from '@ligature/ligature';
import { createToken, CstParser, Lexer } from 'chevrotain';
import { writeValue,
    writeEntity,
    writeAttribute,
    writeStatement,
    processValue,
} from '@ligature/lig';
import { Value, Entity, Attribute, Statement } from '@ligature/ligature';
import { LetStatement, Script, Element, Expression, Identifier, ValueExpression, WanderError, Scope, ReferenceExpression, FunctionDefinition, FunctionCall, NativeFunction, IfExpression, ElseIf, Else } from './ast';
import { debug, TODO } from './debug';
import { Binding } from './binding';
import { stdLib } from './stdlib';

//Tokens that are shared with lig
//TODO all of these tokens should use a shared pattern with @ligature/lig, I don't think I can share the actual tokens though
const WHITE_SPACE_T = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const ANGLE_START_T = createToken({name: "AngleStart", pattern: /</});
const ATTRIBUTE_START_T = createToken({name: "AttributeStart", pattern: /@</});
const ANGLE_END_T = createToken({name: "AngleEnd", pattern: />/});
const LIGATURE_IDENTIFIER_T = createToken({name: "LigatureIdentifier", pattern: identifierPattern});
const IDENTIFIER_T = createToken({name: "Identifier", pattern: /(:?[a-zA-Z_])(:?[a-zA-Z0-9_])*/});
const STRING_T = createToken({name: "String", pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/});
const FLOAT_T = createToken({name: "Float", pattern: /[0-9]+\.[0-9]+/}); //TODO fix pattern to not allow leading zeros
const INTEGER_T = createToken({name: "Integer", pattern: /[0-9]+/}); //TODO fix pattern to not allow leading zeros
const BYTES_T = createToken({name: "Bytes", pattern: /0x(:?[0-9A-Fa-f]{2})+/});

//Tokens that are unique to Wander
const COMMENT_NEW_LINE_T = createToken({ name: "Comment", pattern: /#.*\n/, group: Lexer.SKIPPED });
const COMMENT_END_T = createToken({ name: "Comment", pattern: /#.*/, group: Lexer.SKIPPED });
const COMMA_T = createToken({ name: "Comma", pattern: /,/ });
const NOTHING_T = createToken({ name: "Nothing", pattern: /nothing/ }); //TODO update so it doesn't match longer string
const LET_T = createToken({ name: "Let", pattern: /let/ }); //TODO update so letter doesn't match (see chevrotain docs)
const EQUALS_T = createToken({ name: "Equals", pattern: /=/ });
const BOOLEAN_T = createToken({ name: "Boolean", pattern: /(true)|(false)/ }); //TODO update so it doesn't match longer string
const IF_T = createToken({ name: "If", pattern: /if/ }); //TODO update so it doesn't match longer string
const ELSE_T = createToken({ name: 'Else', pattern: /else/} ); //TODO update so it doesn't match longer string
const WHEN_T = createToken({ name: "When", pattern: /when/ }); //TODO update so it doesn't match longer string
const BRACE_LEFT_T = createToken({ name: "BraceLeft", pattern: /\{/ });
const BRACE_RIGHT_T = createToken({ name: "BraceRight", pattern: /\}/ });
const PAREN_LEFT_T = createToken({ name: "ParenLeft", pattern: /\(/ });
const PAREN_RIGHT_T = createToken({ name: "ParenRight", pattern: /\)/ });
const ARROW_T = createToken({ name:'Arrow', pattern: /->/ });
const DOT_T = createToken({ name: "Dot", pattern: /\./ });

const allTokens = [
    COMMENT_NEW_LINE_T,
    WHITE_SPACE_T,
    COMMA_T,
    LET_T,
    IF_T,
    ELSE_T,
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
    LIGATURE_IDENTIFIER_T,
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
                { ALT: () => $.SUBRULE($.ifExpression)},
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
            $.MANY_SEP({
                SEP: COMMA_T,
                DEF : () => {
                    $.CONSUME(IDENTIFIER_T);
                }
            });
            $.CONSUME(PAREN_RIGHT_T);
            $.CONSUME(ARROW_T);
            $.CONSUME(BRACE_LEFT_T);
            $.MANY(() => {
                $.SUBRULE($.topLevel);
            });
            $.CONSUME(BRACE_RIGHT_T);
        })

        $.RULE('ifExpression', () => {
            $.CONSUME(IF_T);
            $.CONSUME(PAREN_LEFT_T);
            $.SUBRULE($.expression);
            $.CONSUME(PAREN_RIGHT_T);

            $.CONSUME(BRACE_LEFT_T);
            $.SUBRULE2($.expression);
            $.CONSUME(BRACE_RIGHT_T);

            $.MANY(() => {
                $.SUBRULE($.elseIf);
            });
            $.OPTION(() => {
                $.SUBRULE($.else);
            });
        });

        $.RULE('elseIf', () => {
            $.CONSUME(ELSE_T);
            $.CONSUME(IF_T);

            $.CONSUME(PAREN_LEFT_T);
            $.SUBRULE($.expression);
            $.CONSUME(PAREN_RIGHT_T);

            $.CONSUME(BRACE_LEFT_T);
            $.SUBRULE2($.expression);
            $.CONSUME(BRACE_RIGHT_T);
        });

        $.RULE('else', () => {
            $.CONSUME(ELSE_T);
            $.CONSUME(BRACE_LEFT_T);
            $.SUBRULE($.expression);
            $.CONSUME(BRACE_RIGHT_T);
        });

        $.RULE('whenExpression', () => {
            $.CONSUME(WHEN_T);
            //TODO
        });

        $.RULE('functionCall', () => {
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(PAREN_LEFT_T);
            $.MANY_SEP({
                SEP: COMMA_T,
                DEF: () => {
                    $.SUBRULE($.expression);
                }
            });
            $.CONSUME(PAREN_RIGHT_T);
        });

        $.RULE('methodCall', () => {
            $.CONSUME(IDENTIFIER_T);
            $.CONSUME(DOT_T);
            $.CONSUME2(IDENTIFIER_T);
            $.CONSUME(PAREN_LEFT_T);
            $.MANY(() => {
                $.CONSUME3(IDENTIFIER_T);
            });
            $.CONSUME(PAREN_RIGHT_T);
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
            $.OR([
                { ALT: () => $.CONSUME(IDENTIFIER_T) },
                { ALT: () => $.CONSUME(LIGATURE_IDENTIFIER_T) }
            ]);
            $.CONSUME(ANGLE_END_T);
        });

        $.RULE("attribute", () => {
            $.CONSUME(ATTRIBUTE_START_T);
            $.OR([
                { ALT: () => $.CONSUME(IDENTIFIER_T) },
                { ALT: () => $.CONSUME(LIGATURE_IDENTIFIER_T) }
            ]);
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
    ifExpression: any;
    elseIf: any;
    else: any;
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

//the following type and value exist to just help with using Ligature terms in code
export type nothing = null;
export const nothing = null;

//NOTE: keeping the following two types separate for now since I'm not sure if they will always be the same
export type WanderValue = Value | boolean | Attribute | Statement | nothing | FunctionDefinition | NativeFunction | ResultStream<WanderValue>;
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
            return this.scope(ctx.scope[0])
        } else if (ctx.functionCall != undefined) {
            return this.functionCall(ctx.functionCall[0]);
        } else if (ctx.ifExpression != undefined) {
            return this.ifExpression(ctx.ifExpression[0]);
        } else {
            throw new Error("Not implemented.");
        }
    }

    wanderValue(ctx: any): WanderValue {
        if (ctx.Boolean != undefined) {
            return ctx.Boolean[0].image === "true";
        } else if (ctx.value != undefined) {
            return this.value(ctx.value[0])
        } else if (ctx.attribute != undefined) {
            return this.attribute(ctx.attribute[0]);
        } else if (ctx.statement != undefined) {
            return this.statement(ctx.statement[0]);
        } else if (ctx.functionDefinition != undefined) {
            return this.functionDefinition(ctx.functionDefinition[0]);
        } else {
            throw new Error("Not implemented.");
        }
    }

    ifExpression(ctx: any): IfExpression {
        let conditionExpression = this.expression(ctx.children.expression[0].children);
        let body = this.expression(ctx.children.expression[1].children)
        let elseIfs = new Array<ElseIf>();
        if (ctx.children.elseIf != undefined) {
            elseIfs = this.elseIf(ctx.children.elseIf)
        }
        let elseClause = null;
        if (ctx.children.else != undefined) {
            elseClause = this.else(ctx.children.else[0])
        }
        return new IfExpression(conditionExpression, body, elseIfs, elseClause);
    }

    elseIf(ctx: any): Array<ElseIf> {
        let elseIfs = new Array<ElseIf>()
        for (let elseIf of ctx) {
            let conditionExpression = this.expression(elseIf.children.expression[0].children);
            let body = this.expression(elseIf.children.expression[1].children)
            elseIfs.push(new ElseIf(conditionExpression, body))
        }
        return elseIfs
    }

    else(ctx: any): Else {
        let body = this.expression(ctx.children.expression[0].children)
        return new Else(body);
    }

    functionDefinition(ctx: any): FunctionDefinition {
        let parameters = new Array<string>();
        let body = new Array<Element>();
        if (ctx.children.Identifier != undefined) {
            for (let p of ctx.children.Identifier) {
                parameters.push(p.image)
            }
        }
        if (ctx.children.topLevel != undefined) {
            for (let ts of ctx.children.topLevel) {
                body.push(this.topLevel(ts.children));
            }
        }
        return new FunctionDefinition(parameters, body)
    }

    whenExpression(ctx: any) {
        throw new Error("Not implemented.");
    }

    functionCall(ctx: any): FunctionCall {
        let identifer = new Identifier(ctx.children.Identifier[0].image);
        let parameters = new Array<Expression>();
        if (ctx.children.expression != undefined) {
            for (let ex of ctx.children.expression) {
                let expression = this.expression(ex.children);
                parameters.push(expression);
            }
        }
        return new FunctionCall(identifer, parameters);
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

    statement(ctx: any): Statement {
        const entity = this.entity(ctx.children.entity[0]);
        const attribute = this.attribute(ctx.children.attribute[0]);
        const value = processValue(ctx.children.value[0]);
        const context = this.entity(ctx.children.entity[1]);
        return new Statement(entity, attribute, value, context);
    }

    entity(ctx: any): Entity {
        if (ctx.children.LigatureIdentifier != undefined) {
            return new Entity(ctx.children.LigatureIdentifier[0].image);
        } else if (ctx.children.Identifier != undefined) {
            return new Entity(ctx.children.Identifier[0].image);
        } else {
            throw new Error("Invalid Entity.");
        }
    }

    attribute(ctx: any): Attribute {
        if (ctx.children.LigatureIdentifier != undefined) {
            return new Attribute(ctx.children.LigatureIdentifier[0].image);
        } else if (ctx.children.Identifier != undefined) {
            return new Attribute(ctx.children.Identifier[0].image);
        } else {
            throw new Error("Invalid Attribute.");
        }
    }

    value(ctx: any): WanderValue {
        if (ctx.children.Integer != undefined) {
            return BigInt(ctx.children.Integer[0].image);
        } else if (ctx.children.Float != undefined) {
            return Number(ctx.children.Float[0].image);
        } else if (ctx.children.String != undefined) {
            const stringValue = ctx.children.String[0].image;
            return stringValue.substring(1,stringValue.length-1);
        } else if (ctx.children.entity != undefined) {
            return this.entity(ctx.children.entity[0]);
        } else {
            throw new Error("Unsupported Wander Value - " + ctx.value[0].children);
        }
    }
}

const wanderVisitor = new WanderVisitor();

export type NoScope = { scopeType: "None" }
export type InstanceScope = { scopeType: "Instance", instance: Ligature }
export type ReadScope = { scopeType: "ReadTx", readTx: ReadTx }
export type WriteScope = { scopeType: "WriteTx", writeTx: WriteTx }
export type ExecutionScope = NoScope | InstanceScope | ReadScope | WriteScope

export class WanderInterpreter {
    run(script: string, scope: ExecutionScope = { scopeType: "None" }): WanderResult | WanderError {
        const res = this.createAst(script);
        if (res instanceof WanderError) {
            return res;
        } else {
            return this.eval(res, scope);
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

    eval(script: Script, scope: ExecutionScope): WanderResult | WanderError {
        let bindings = stdLib(scope);
        return script.eval(bindings);
    }
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
    } else if (instanceOfResultStream(result)) {
        let i = 0
        let str = "["
        while (i < 100) {
            let next = result.next()
            if (next instanceof )
        }
        return "TODO"
    } else {
        throw new Error("Not implemented.");
    }
}
