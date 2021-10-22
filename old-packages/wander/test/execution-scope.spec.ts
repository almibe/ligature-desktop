/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from 'chai';
import { WanderInterpreter } from '../lib';
import { Identifier } from '../lib/ast';
import { Binding } from '../lib/binding';
import { openLigatureSimpleIndexedDB } from '@ligature/ligature-indexeddb/lib/simple/index'

describe('Scoping tests', () => {
    it('run with no scope', () => {
        let wander = new WanderInterpreter()
        let ligature = openLigatureSimpleIndexedDB("test")

        let res = wander.run("5")
        expect(res).to.be.eql(5n)

        let res2 = wander.run(`"test"`, { scopeType: "None" })
        expect(res2).to.be.eql("test")
    })

    it('run with instance scope', () => {
        let wander = new WanderInterpreter()
        let ligature = openLigatureSimpleIndexedDB("test")

        //allDatasets -- should be empty
        let allDatasets = wander.run(`
            allDatasets()
        `)
        

        wander.run(`
            createDataset("newDataset")
        `)

        //allDatasets -- should not be empty

        //datasetExists

        //matchDatasetPrefix


        //matchDatasetRange

        //deleteDataset

        //query

        //write

    })

    it('run with Dataset read scope', () => {
        let wander = new WanderInterpreter()
        let ligature = openLigatureSimpleIndexedDB("test")

        //allStatements

        //matchStatements

        throw new Error("Not implemented.")
    })

    it('run with Dataset write scope', () => {
        let wander = new WanderInterpreter()
        let ligature = openLigatureSimpleIndexedDB("test")

        //newEntity

        //addStatement

        //removeStatement

        //cancel

        throw new Error("Not implemented.")
    })
})
