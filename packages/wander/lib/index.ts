/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { createToken, CstParser, Lexer } from 'chevrotain';
import { WHITE_SPACE_T,
    ANGLE_START_T,
    ATTRIBUTE_START_T,
    ANGLE_END_T,
    IDENTIFIER_T,
    STRING_T,
    BYTES_T,
    FLOAT_T,
    INTEGER_T
} from '@ligature/lig';

const COMMENT_T = createToken({ name: "Comment", pattern: /#.*\n/, group: Lexer.SKIPPED });
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
    COMMENT_T,
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
    INTEGER_T
];

class WanderParser extends CstParser {
    constructor() {
        super(allTokens, {maxLookahead: 4});

        const $ = this;

        $.RULE('topLevel', () => {
            $.OR([
                { ALT: () => $.CONSUME(COMMENT_T) },
                { ALT: () => $.SUBRULE($.expression) },
                { ALT: () => $.SUBRULE($.letStatement) }
            ])
        })

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
            })
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

let wanderLexer = new Lexer(allTokens);
let wanderParser = new WanderParser();

export class WanderInterpreter {
    run(script: string): any {
        return "nothing";
    }
}
