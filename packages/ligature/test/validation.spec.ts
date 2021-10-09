/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { validateIntegerLiteral, Identifier, Dataset, InvalidDataset, InvalidIdentifier } from "../lib/index"
import { should } from 'chai'
import { Left, Right } from "purify-ts"

should()

let okays = [
    "test",
    "test_test_test",
    "test_test",
    "this1_is2_a_test",
    "_",
    "_test",
    "__test__",
    "testTest",
    "G",
    "test!",
    "test//test",
    "HELLO",
    "2",
    "5test",
    "/_/_",
]

let errs = [
    "",
    "this is a test",
    "test test",
    "test/ /test",
    " test"
]

describe("Dataset validation", () => {
    it("check valid Dataset names", () => {
        okays.forEach((ok) => {
            Dataset.from(ok).unsafeCoerce().name.should.be.eql(ok)
        })
    })

    it("check invalid Dataset names", () => {
        errs.forEach((err) => {
            Dataset.from(err).should.be.eql(Left(InvalidDataset))
        })
    })
})

describe("Identifier validation", () => {
    it("check valid Identifier names", () => {
        okays.forEach((ok) => {
            let id = Identifier.from(ok).unsafeCoerce()
            id.id.should.be.eql(ok)
        })
    })

    it("check invalid Identifier names", () => {
        errs.forEach((err) => {
            Identifier.from(err).should.be.eql(Left(InvalidIdentifier))
        })
    })
})

describe("Integer Literal validation", () => {
    it("check valid Integer Literal values", () => {
        [0n, -9223372036854775808n, 9223372036854775807n].forEach((num) => {
            validateIntegerLiteral(num).should.be.true
        })
    })

    it("check invalid Integer Literal values", () => {
        [-9223372036854775809n, 9223372036854775808n].forEach((num) => {
            validateIntegerLiteral(num).should.be.false
        })
    })
})
