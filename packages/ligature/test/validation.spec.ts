/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Left, Right } from "purify-ts"
import { validateIntegerLiteral, Identifier, Dataset, InvalidDataset, InvalidIdentifier } from "../lib/index"

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

test("check valid Dataset names", () => {
    okays.forEach((ok) => {
        expect(Dataset.from(ok)).toEqual(Right({name: ok}))
    })
})

test("check invalid Dataset names", () => {
    errs.forEach((err) => {
        expect(Dataset.from(err)).toEqual(Left(InvalidDataset))
    })
})

test("check valid Identifier names", () => {
    okays.forEach((ok) => {
        let id = Identifier.from(ok).unsafeCoerce()
        expect(id.id).toEqual(ok)
    })
})

test("check invalid Identifier names", () => {
    errs.forEach((err) => {
        expect(Identifier.from(err)).toEqual(Left(InvalidIdentifier))
    })
})

test("check valid Integer Literal values", () => {
    [0n, -9223372036854775808n, 9223372036854775807n].forEach((num) => {
        expect(validateIntegerLiteral(num)).toBe(true)
    })
})

test("check invalid Integer Literal values", () => {
    [-9223372036854775809n, 9223372036854775808n].forEach((num) => {
        expect(validateIntegerLiteral(num)).toBe(false)
    })
})
