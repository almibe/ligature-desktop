/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { writeEntity, writeAttribute, writeValue, write } from "../lib";
import { Entity, Attribute, Statement } from "@ligature/ligature";
import { should } from "chai";

should();

describe("Writing Lig", () => {
    it("Write Entities", () => {
        let e = new Entity("test");
        writeEntity(e).should.be.equal("<test>");
    });

    it("Write Attributes", () => {
        let a = new Attribute("test");
        writeAttribute(a).should.be.equal("@<test>");
    });

    it("Write String Literals", () => {
        writeValue("test").should.be.equal('"test"');
    });

    it("Write Integer Literals", () => {
        writeValue(5n).should.be.equal("5");
    });

    it("Write Float Literals", () => {
        writeValue(5.5).should.be.equal("5.5");
        writeValue(5).should.be.equal("5.0");
    });

    it("Write Byte Arrays Literals", () => {
        writeValue(new Uint8Array([0,255])).should.be.equal("0x00ff");
    });

    it("Write Set of Statements", () => {
        let statements = [
            new Statement(new Entity("e"), new Attribute("a"), 234n, new Entity("c")),
            new Statement(new Entity("e"), new Attribute("a2"), "test", new Entity("c2"))
        ]
        let expected = "<e> @<a> 234 <c>\n<e> @<a2> \"test\" <c2>\n";
        write(statements).should.be.equal(expected)
    });
});
