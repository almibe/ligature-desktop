/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Entity } from "@ligature/ligature";

describe("Writing Lig", () => {
    it("Write Entities", () => {
        let e = new Entity("test");

        expect(writeEntity(e)).should.be.equal("<test>");
    });

    it("Write Attributes", () => {
        throw new Error("Not implemented.");
    });

    it("Write String Literals", () => {
        throw new Error("Not implemented.");
    });

    it("Write Integer Literals", () => {
        throw new Error("Not implemented.");
    });

    it("Write Float Literals", () => {
        throw new Error("Not implemented.");
    });

    it("Write Byte Arrays Literals", () => {
        throw new Error("Not implemented.");
    });

    it("Write Set of Statements", () => {
        throw new Error("Not implemented.");
    });
});
