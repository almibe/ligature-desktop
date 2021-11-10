/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Either, Right } from "purify-ts"
import { Identifier, LongLiteral, Statement } from "../../ligature/lib"
import { read, readIdentifier, readValue } from "../lib"

test("Read Identifiers", () => {
    let e = "<test>"
    expect(readIdentifier(e)).toEqual(Identifier.from("test"))
})

test("Read String Literals", () => {
    let s = '"test"'
    expect(readValue(s).unsafeCoerce()).toEqual("test")
})

test("Read Integer Literals", () => {
    let i = "243"
    expect(readValue(i).unsafeCoerce()).toEqual(LongLiteral.from(243n).unsafeCoerce())
})

test("Read Byte Arrays Literals", () => {
    let b = "0x00ff"
    expect(readValue(b)).toEqual(Right(new Uint8Array([0, 255])))
})

test("Read Identifier as Value", () => {
    let e = "<test>"
    expect(readValue(e)).toEqual(Identifier.from("test"))
})

test("Read Empty Set of Statements", () => {
    let s = ""
    let expected: Either<never, Array<Statement>> = Right([])
    expect(read(s)).toEqual(expected)
})

test("Read Set of Statements", () => {
    let s = "<e> <a> 0x00ff <c>\n<e> <a> 123 <c>\n<e2> <a> <e> <c2>\n"
    let expected = [
        new Statement(Identifier.from("e").unsafeCoerce(), Identifier.from("a").unsafeCoerce(), new Uint8Array([0, 255]), Identifier.from("c").unsafeCoerce()),
        new Statement(Identifier.from("e").unsafeCoerce(), Identifier.from("a").unsafeCoerce(), LongLiteral.from(123n).unsafeCoerce(), Identifier.from("c").unsafeCoerce()),
        new Statement(Identifier.from("e2").unsafeCoerce(), Identifier.from("a").unsafeCoerce(), Identifier.from("e").unsafeCoerce(), Identifier.from("c2").unsafeCoerce())
    ]
    expect(read(s).unsafeCoerce()).toEqual(expected)
})
