/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';
import { Dataset, Entity, Attribute, Statement, Ligature } from '@ligature/ligature';
import type { Value } from '@ligature/ligature';
import { valueType, encodeInteger, decodeInteger, ENTITY_VALUE_TYPE, STRING_VALUE_TYPE, INTEGER_VALUE_TYPE, FLOAT_VALUE_TYPE, BYTES_VALUE_TYPE } from '../lib/util';

let newDataset = new Dataset("newDataset");

export function commonTests() {
    describe("Utility functions", () => {
        it("Should allow encoding a Value's type for storage", () => {
            let values: Array<Value> = [new Entity("test"), "Hello", 1234n, 3.14, new Uint8Array([2, 123, 42])];
            let expected: Array<number> = [ENTITY_VALUE_TYPE, STRING_VALUE_TYPE, INTEGER_VALUE_TYPE, FLOAT_VALUE_TYPE, BYTES_VALUE_TYPE];
            let results = values.map(v => valueType(v));
            expect(results).to.be.eql(expected);
        });
    
        it("should allow encoding integers to byte arrays", () => {
            let smallest = -9223372036854775808n
            let largest  =  9223372036854775807n
            let tooSmall = smallest - 1n;
            let tooLarge = largest + 1n;
    
            expect(encodeInteger(smallest)).to.be.eql(new Uint8Array([0,0,0,0,0,0,0,0]));
            expect(encodeInteger(largest)).to.be.eql(new Uint8Array([255,255,255,255,255,255,255,255]));
            expect(() => encodeInteger(tooSmall)).to.throw(/out of range/);
            expect(() => encodeInteger(tooLarge)).to.throw(/out of range/);
        });
    
        it("should allow decoding integers for storage", () => {
            let smallest = new Uint8Array([0,0,0,0,0,0,0,0]);
            let largest = new Uint8Array([255,255,255,255,255,255,255,255]);
            let tooSmall = new Uint8Array([0,0,0,0,0,0,0]);
            let tooLarge = new Uint8Array([0,0,0,0,0,0,0,0,0]);
    
            expect(decodeInteger(smallest)).to.be.equal(-9223372036854775808n);
            expect(decodeInteger(largest)).to.be.equal(9223372036854775807n);
            expect(() => decodeInteger(tooSmall)).to.throw(/64bit/);
            expect(() => decodeInteger(tooLarge)).to.throw(/64bit/);
        });
    
        it("should allow encoding and decoding integers for storage", () => {
            for(let x = 0; x < 100; x++) {
                let input = BigInt(Math.floor(Math.random() * (2000001) + -1000000));
                let encoded = encodeInteger(input);
                let decoded = decodeInteger(encoded);
                expect(decoded).to.be.equal(input);
            }
        });
    });    
}

export function runTests(name: string, create: (name: string) => Promise<Ligature>) {
    describe('Datasets Support for ' + name, () => {
        it('should open and close cleanly', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            let ds = await instance.allDatasets();
            expect(ds.length).to.be.equal(0);
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow creating new datasets', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
            let datasets = await instance.allDatasets();
            expect(datasets.length).to.be.equal(1);
            expect(datasets[0].equals(newDataset)).to.be.true;
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;        
        });
    
        it('should allow checking if dataset exists', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
            let testExists = await instance.datasetExists(new Dataset("test"))
            expect(testExists).to.be.false;
            let newDatasetExists = await instance.datasetExists(newDataset)
            expect(newDatasetExists).to.be.true;
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow finding Datasets by prefix', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(new Dataset("anewDataset"));
            await instance.createDataset(newDataset);
            await instance.createDataset(new Dataset("newDataset01"));
            await instance.createDataset(new Dataset("newDataset02"));
            await instance.createDataset(new Dataset("newDataset03"));
            await instance.createDataset(new Dataset("znewDataset"));
    
            let res1 = (await instance.matchDatasetPrefix("n")).length;
            let res2 = (await instance.matchDatasetPrefix("a")).length;
            let res3 = (await instance.matchDatasetPrefix("s")).length;
            let res4 = (await instance.matchDatasetPrefix("newDataset0")).length;
            let res5 = (await instance.matchDatasetPrefix("newDataset01")).length;
    
            expect(res1).to.be.equal(4);
            expect(res2).to.be.equal(1);
            expect(res3).to.be.equal(0);
            expect(res4).to.be.equal(3);
            expect(res5).to.be.equal(1);
    
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow finding Datasets by range', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(new Dataset("anewDataset"));
            await instance.createDataset(newDataset);
            await instance.createDataset(new Dataset("newDataset01"));
            await instance.createDataset(new Dataset("newDataset02"));
            await instance.createDataset(new Dataset("newDataset03"));
            await instance.createDataset(new Dataset("znewDataset"));
    
            let res1 = (await instance.matchDatasetRange("a","zz")).length;
            let res2 = (await instance.matchDatasetRange("anew", "bnew")).length;
            let res3 = (await instance.matchDatasetRange("anewE", "m")).length;
            let res4 = (await instance.matchDatasetRange(newDataset.name, "newDataset02")).length;
            let res5 = (await instance.matchDatasetRange("newDataset03", "zz")).length;
    
            expect(res1).to.be.equal(6);
            expect(res2).to.be.equal(1);
            expect(res3).to.be.equal(0);
            expect(res4).to.be.equal(2);
            expect(res5).to.be.equal(2);
    
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow deleting a Dataset', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(new Dataset("anewDataset"));
            await instance.createDataset(newDataset);
            await instance.createDataset(new Dataset("newDataset01"));
            await instance.createDataset(new Dataset("newDataset02"));
            await instance.createDataset(new Dataset("newDataset03"));
            await instance.createDataset(new Dataset("znewDataset"));
    
            await instance.deleteDataset(newDataset);
            await instance.deleteDataset(new Dataset("newDataset02"));
            await instance.deleteDataset(new Dataset("zznewDataset"));
            let total = (await instance.allDatasets()).length;
    
            expect(total).to.be.equal(4);
    
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    });
    
    describe('Statement Support for ' + name, () => {
        it('should create new Datasets with zero Statements', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let res = await instance.query(newDataset, (readTx) => {
                return readTx.allStatements()
            });
            expect(res.length).to.be.equal(0);
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow generating new Entities that are prefixed UUIDs', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let entityRes = await instance.write(newDataset, (writeTx) => {
                return writeTx.generateEntity("test");
            });
            expect(entityRes.id).to.match(/^test[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow adding Statements to a Dataset', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
            await instance.write(newDataset, async (writeTx) => {
                await writeTx.addStatement(statement);
                return Promise.resolve(); //TODO should find a way to remove this
            });
            let res = await instance.query(newDataset, (readTx) => {
                return readTx.allStatements()
            });
            expect(res.length).to.be.equal(1);
            let statementFromStore = res[0];
            expect(statement.equals(statementFromStore)).to.be.true;
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow removing Statements from a Dataset', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
            let statement2 = new Statement(new Entity("e2"), new Attribute("a2"), BigInt(65), new Entity("c2"));
            await instance.write(newDataset, async (writeTx) => {
                await writeTx.addStatement(statement);
                await writeTx.addStatement(statement2);
                return Promise.resolve(); //TODO should find a way to remove this
            });
            await instance.write(newDataset, async (writeTx) => {
                await writeTx.removeStatement(statement2);
                await writeTx.removeStatement(new Statement(new Entity("e2"), new Attribute("a"), "value", new Entity("c")));
                return Promise.resolve(); //TODO should find a way to remove this
            });
            let res = await instance.query(newDataset, (readTx) => {
                return readTx.allStatements()
            });
            expect(res.length).to.be.equal(1);
            let statementFromStore = res[0];
            expect(statement.equals(statementFromStore)).to.be.true;
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow canceling a WriteTx', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
            let statement2 = new Statement(new Entity("e2"), new Attribute("a2"), new Entity("__"), new Entity("c2"));
            await instance.write(newDataset, async (writeTx) => {
                await writeTx.addStatement(statement);
                await writeTx.addStatement(statement2);
                writeTx.cancel();
                return Promise.resolve(); //TODO should find a way to remove this
            });
            let res = await instance.query(newDataset, (readTx) => {
                return readTx.allStatements()
            });
            expect(res.length).to.be.equal(0);
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow matching Statements from a Dataset', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
            let statement2 = new Statement(new Entity("e2"), new Attribute("a2"), new Entity("__"), new Entity("c2"));
            await instance.write(newDataset, async (writeTx) => {
                await writeTx.addStatement(statement);
                await writeTx.addStatement(statement2);
                return Promise.resolve(); //TODO should find a way to remove this
            });
            let res = await instance.query(newDataset, (readTx) => {
                return readTx.matchStatements(new Entity("e2"), new Attribute("a2"), new Entity("__"), new Entity("c2"));
            });
            let res2 = await instance.query(newDataset, (readTx) => {
                return readTx.matchStatements(null, null, null, null);
            });
            expect(res.length).to.be.equal(1);
            expect(res2.length).to.be.equal(2);
            expect(res[0]).to.be.eql(statement2);
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    
        it('should allow matching Statements with Literals and LiteralRanges in Datasets', async () => {
            let instance = await create("test-" + uuidv4());
            expect(instance.isOpen()).to.be.true;
            await instance.createDataset(newDataset);
    
            let statement = new Statement(new Entity("e"), new Attribute("a"), 1, new Entity("c"));
            let statement2 = new Statement(new Entity("e2"), new Attribute("a2"), 1.1, new Entity("c2"));
            let statement3 = new Statement(new Entity("e"), new Attribute("a"), 1.5, new Entity("c3"));
            let statement4 = new Statement(new Entity("e2"), new Attribute("a2"), 1.9, new Entity("c4"));
            await instance.write(newDataset, async (writeTx) => {
                await writeTx.addStatement(statement);
                await writeTx.addStatement(statement2);
                await writeTx.addStatement(statement3);
                await writeTx.addStatement(statement4);
                return Promise.resolve(); //TODO should find a way to remove this
            });
            let res = await instance.query(newDataset, (readTx) => {
                return readTx.matchStatements(null, null, {start: 1, end: 1.9}, null);
            });
            expect(res.length).to.be.equal(3);
            expect(res[0]).to.be.eql(statement);
            expect(res[1]).to.be.eql(statement2);
            expect(res[2]).to.be.eql(statement3);
            await instance.close(true);
            expect(instance.isOpen()).to.be.false;
        });
    });    
}
