/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Statement, Entity, Attribute, identifierPattern } from "@ligature/ligature";
import type { Value } from '@ligature/ligature';
import { createToken, CstParser, Lexer } from 'chevrotain';

const WHITE_SPACE = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
const ANGLE_START = createToken({name: "AngleStart", pattern: /</});
const ATTRIBUTE_START = createToken({name: "AttributeStart", pattern: /@</});
const ANGLE_END = createToken({name: "AngleEnd", pattern: />/});
const IDENTIFIER = createToken({name: "Identifier", pattern: identifierPattern});
const STRING = createToken({name: "String", pattern: /"[a-zA-Z 0-9]"/}); //TODO fix pattern
const FLOAT = createToken({name: "Float", pattern: /[0-9]+\.[0-9]+/}); //TODO fix pattern to not allow leading zeros
const INTEGER = createToken({name: "Integer", pattern: /[0-9]+/}); //TODO fix pattern to not allow leading zeros
const BYTES = createToken({name: "Bytes", pattern: /0x[0-9A-Fa-f]+/});

let allTokens = [
    WHITE_SPACE,
    ANGLE_START,
    ATTRIBUTE_START,
    ANGLE_END,
    IDENTIFIER,
    STRING,
    FLOAT,
    INTEGER,
    BYTES
];

class LigParser extends CstParser {
    constructor() {
        super(allTokens);

        const $ = this;

        $.RULE("entity", () => {
            $.CONSUME(ANGLE_START);
            $.CONSUME(IDENTIFIER);
            $.CONSUME(ANGLE_END);
        });

        $.RULE("attribute", () => {
            $.CONSUME(ATTRIBUTE_START);
            $.CONSUME(IDENTIFIER);
            $.CONSUME(ANGLE_END);
        });

        $.RULE("value", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.entity) },
                { ALT: () => $.CONSUME(STRING) },
                { ALT: () => $.CONSUME(FLOAT) },
                { ALT: () => $.CONSUME(INTEGER) },
                { ALT: () => $.CONSUME(BYTES) }
            ])
        });

        $.RULE("statement", () => {
            $.SUBRULE2($.entity);
            $.SUBRULE($.attribute);
            $.SUBRULE($.value);
            $.SUBRULE($.entity);
        });

        $.RULE("statements", () => {
            $.MANY($.statement);
        });

        this.performSelfAnalysis();
    }

    //properties below just exist to make TS happy
    entity: any;
    attribute: any;
    value: any;
    statement: any;
}

let ligLexer = new Lexer(allTokens);
let ligParser = new LigParser();

const LigatureCtsVisitor = ligParser.getBaseCstVisitorConstructor();

class LigatureInterpreter extends LigatureCtsVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    entity(ctx: any): Entity {
        throw new Error("Not implemented.")
    }

    attribute(ctx: any): Attribute {
        throw new Error("Not implemented.")
    }

    value(ctx: any): Value {
        throw new Error("Not implemented.")
    }

    statement(ctx: any): Statement {
        throw new Error("Not implemented.")
    }

    statements(ctx: any): Array<Statement> {
        throw new Error("Not implemented.")
    }
}

const interpreter = new LigatureInterpreter();

export function read(input: string): Array<Statement> {
    throw new Error("Not implemented.");
}

export function readStatement(input: string): Statement {
    throw new Error("Not implemented.");
}

export function readEntity(input: string): Entity {
    const lexResult = ligLexer.tokenize(input);
    ligParser.input = lexResult.tokens;
    let res = ligParser.entity();
    if (res == undefined) {
        throw new Error("Could not read Entity from - " + input);
    } else {
        return new Entity(res.children.Identifier[0].image);
    }
}

export function readAttribute(input: string): Attribute {
    const lexResult = ligLexer.tokenize(input);
    ligParser.input = lexResult.tokens;
    let res = ligParser.attribute();
    if (res == undefined) {
        throw new Error("Could not read Attribute from - " + input);
    } else {
        return new Attribute(res.children.Identifier[0].image);
    }
}

export function readValue(input: string): Value {
    throw new Error("Not implemented.");
}
