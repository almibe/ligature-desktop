/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { should } from "chai";
import { Identifier, LongLiteral, Statement } from "../../ligature/lib";
import { read, readIdentifier, readValue } from "../lib";

should();

describe("Reading Lig", () => {
    it("Read Identifiers", () => {
        let e = "<test>";
        readIdentifier(e).should.be.eql(Identifier.from("test"));
    });

    it("Read String Literals", () => {
        let s = '"test"';
        readValue(s).should.be.equal("test");
    });

    it("Read Integer Literals", () => {
        let i = "243";
        readValue(i).should.be.equal(243n);
    });

    it("Read Float Literals", () => {
        let f = "1.2";
        readValue(f).should.be.equal(1.2);
    });

    it("Read Byte Arrays Literals", () => {
        let b = "0x00ff";
        readValue(b).should.be.eql(new Uint8Array([0, 255]));
    });

    it("Read Identifier as Value", () => {
        let e = "<test>";
        readValue(e).should.be.eql(Identifier.from("test"));
    })

    it("Read Empty Set of Statements", () => {
        let s = "";
        let expected: Array<Statement> = [];
        read(s).should.be.eql(expected);
    });

    it("Read Set of Statements", () => {
        let s = "<e> <a> 123 <c>\n<e2> <a> <e> <c2>\n";
        let expected = [
            new Statement(Identifier.from("e").unsafeCoerce(), Identifier.from("a").unsafeCoerce(), LongLiteral.from(123n).unsafeCoerce(), Identifier.from("c").unsafeCoerce()),
            new Statement(Identifier.from("e2").unsafeCoerce(), Identifier.from("a").unsafeCoerce(), Identifier.from("e").unsafeCoerce(), Identifier.from("c2").unsafeCoerce())
        ];
        read(s).should.be.eql(expected);
    });
});
