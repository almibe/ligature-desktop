/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { createToken, CstNode, CstParser, Lexer } from 'chevrotain';
import { WHITE_SPACE_T,
    ANGLE_START_T,
    ATTRIBUTE_START_T,
    ANGLE_END_T,
    IDENTIFIER_T,
    STRING_T,
    BYTES_T,
    FLOAT_T,
    INTEGER_T,
    writeValue,
    writeEntity
} from '@ligature/lig';
import { Value, Entity } from '@ligature/ligature';

const COMMENT_NEW_LINE_T = createToken({ name: "Comment", pattern: /#.*\n/, group: Lexer.SKIPPED });
const COMMENT_END_T = createToken({ name: "Comment", pattern: /#.*/, group: Lexer.SKIPPED });
const LET_T = createToken({ name: "Let", pattern: /let/ }); //TODO update so letter doesn't match (see chevrotain docs)
const EQUALS_T = createToken({ name: "Equals", pattern: /=/ });
const BOOLEAN_T = createToken({ name: "Boolean", pattern: /(true)|(false)/ });
const WHEN_T = createToken({ name: "when", pattern: /when/ });
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
                { ALT: () => $.SUBRULE($.expression) },
                { ALT: () => $.SUBRULE($.letStatement) }
            ]);
        });

        $.RULE('letStatement', () => {
            $.CONSUME(LET_T);
            $.CONSUME(EQUALS_T);
            $.SUBRULE($.expression);
        });

        $.RULE('expression', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.wanderValue) },
                { ALT: () => $.SUBRULE($.whenExpression) },
                { ALT: () => $.SUBRULE($.functionCall) },
                { ALT: () => $.SUBRULE($.methodCall) }
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
        })

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

class WanderVisitor extends BaseWanderVisitor {
    debug(a: any) {
        console.log(JSON.stringify(a, undefined, 4));
    }

    constructor() {
        super();
        this.validateVisitor();
    }

    script(ctx: any): any {
        if (ctx.topLevel != undefined) {
            return this.visit(ctx.topLevel);
        } else {
            return "nothing";
        }
    }

    topLevel(ctx: any) {
        if (ctx.expression != undefined) {
            return this.visit(ctx.expression)
        } else {
            throw new Error("Not implemented.");
        }
    }

    letStatement(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    expression(ctx: any) {
        if (ctx.wanderValue != undefined) {
            return this.visit(ctx.wanderValue);
        } else {
            throw new Error("Not implemented.");
        }
    }

    wanderValue(ctx: any) {
        if (ctx.Boolean != undefined) {
            return ctx.Boolean[0].image === "true";
        } else if (ctx.value != undefined) {
            if (ctx.value[0].children.Integer != undefined) {
                return BigInt(ctx.value[0].children.Integer[0].image);
            } else if (ctx.value[0].children.Float != undefined) {
                return Number(ctx.value[0].children.Float[0].image);
            }
        } else {
            this.debug(ctx);
            throw new Error("Not implemented.");
        }
    }

    functionDefinition(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    whenExpression(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    functionCall(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    methodCall(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    statements(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    statement(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    entity(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    attribute(ctx: CstNode) {
        throw new Error("Not implemented.");
    }

    value(ctx: CstNode) {
        throw new Error("Not implemented.");
    }
}

const wanderVisitor = new WanderVisitor();

export type WanderResult = Value | boolean;

export class WanderInterpreter {
    run(script: string): WanderResult {
        const lexResult = wanderLexer.tokenize(script);
        wanderParser.input = lexResult.tokens;
        const res = wanderVisitor.visit(wanderParser.script());
        return res;
    }
}

/**
 * Writes a given WanderResult as a string, referring to the lig implementation of write functions when applicable.
 * @param result A WanderResult.
 * @returns The serialized (not just toStringed) version of that WanderResult.
 */
export function write(result: WanderResult): string {
    if (typeof result == "number") {
        return writeValue(result);
    } else if (typeof result == "string") {
        return writeValue(result);
    } else if (result instanceof Entity) {
        return writeEntity(result);
    } else if (typeof result == "bigint") {
        return writeValue(result);
    } else if (typeof result == "boolean") {
        return result.toString();
    } else {
        throw new Error("Not implemented.");
    }
}
