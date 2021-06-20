/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { should } from 'chai';
import { validateAttribute, validateDataset, validateEntity, validateIntegerLiteral, Entity, Attribute } from "../lib/index";

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
    "HELLO"
]

let errs = [
    "",
    "2",
    "5test",
    "this is a test",
    "/_/_",
    "test test",
    "test/ /test",
    " test"
];

should();

describe("Dataset validation", () => {
    it("check valid Dataset names", () => {
        okays.forEach((ok) => {
            validateDataset(ok).should.be.true;
        })
    })

    it("check invalid Dataset names", () => {
        errs.forEach((err) => {
            validateDataset(err).should.be.false;
        })
    })
})

describe("Entity validation", () => {
    it("check valid Entity names", () => {
        okays.forEach((ok) => {
            validateEntity(ok).should.be.true;
        })
    })

    it("check invalid Entity names", () => {
        errs.forEach((err) => {
            validateEntity(err).should.be.false;
        })
    })
})

describe("Attribute validation", () => {
    it("check valid Attribute names", () => {
        okays.forEach((ok) => {
            validateAttribute(ok).should.be.true;
        })
    })

    it("check invalid Attribute names", () => {
        errs.forEach((err) => {
            validateAttribute(err).should.be.false;
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
