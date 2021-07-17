/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { should } from "chai";
import { Entity, Attribute, Statement } from "../../ligature/lib";
import { read, readAttribute, readEntity, readValue } from "../lib";

should();

describe("Reading Lig", () => {
    it("Read Entities", () => {
        let e = "<test>";
        readEntity(e).should.be.eql(new Entity("test"));
    });

    it("Read Attributes", () => {
        let a = "@<test>";
        readAttribute(a).should.be.eql(new Attribute("test"));
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

    it("Read Set of Statements", () => {
        let s = "<e> <a> 123 <c>\n<e2> <a> <e> <c2>\n";
        let expected = [
            new Statement(new Entity("e"), new Attribute("a"), 123n, new Entity("c")),
            new Statement(new Entity("e2"), new Attribute("a"), new Entity("e"), new Entity("c2"))
        ];
        read(s).should.be.equal(expected);
    });
});
