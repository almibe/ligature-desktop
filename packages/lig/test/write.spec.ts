/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { writeIdentifier, writeValue, write } from "../lib"
import { Identifier, LongLiteral, Statement } from "@ligature/ligature"
import { should } from "chai"

should();

describe("Writing Lig", () => {
    it("Write Identifiers", () => {
        let identifier = Identifier.from("test").unsafeCoerce()
        writeIdentifier(identifier).should.be.equal("<test>")
    })

    it("Write String Literals", () => {
        writeValue("test").should.be.equal('"test"')
    })

    it("Write Integer Literals", () => {
        writeValue(LongLiteral.from(5n).unsafeCoerce()).should.be.equal("5")
    })

    it("Write Byte Arrays Literals", () => {
        writeValue(new Uint8Array([0,255])).should.be.equal("0x00ff")
    })

    it("Write Set of Statements", () => {
        let statements = [
            new Statement(Identifier.from("e").unsafeCoerce(), Identifier.from("a").unsafeCoerce(), LongLiteral.from(234n).unsafeCoerce(), Identifier.from("c").unsafeCoerce()),
            new Statement(Identifier.from("e").unsafeCoerce(), Identifier.from("a2").unsafeCoerce(), "test", Identifier.from("c2").unsafeCoerce())
        ]
        let expected = "<e> <a> 234 <c>\n<e> <a2> \"test\" <c2>\n"
        write(statements).should.be.equal(expected)
    })
})
