'use strict';

import { LigatureDexie } from '../lib';
import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';
import { Dataset, Entity, Attribute, Statement } from '../../ligature/lib';

let newDataset = new Dataset("newDataset");

describe('Datasets Support', () => {
    it('should open and close cleanly', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        let ds = await instance.allDatasets();
        expect(ds.length).to.be.equal(0);
        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow creating new datasets', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);
        let datasets = await instance.allDatasets();
        expect(datasets.length).to.be.equal(1);
        expect(datasets[0].equals(newDataset)).to.be.true;
        await instance.close(true);
        expect(instance.isOpen()).to.be.false;        
    });

    it('should allow checking if dataset exists', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
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
        let instance = new LigatureDexie("test-" + uuidv4());
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
        let instance = new LigatureDexie("test-" + uuidv4());
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
        let instance = new LigatureDexie("test-" + uuidv4());
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

describe('Statement Support', () => {
    it('should create new Datasets with zero Statements', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
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
        let instance = new LigatureDexie("test-" + uuidv4());
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
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);

        let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
        await instance.write(newDataset, (writeTx) => {
            writeTx.addStatement(statement);
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
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);

        let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
        let statement2 = new Statement(new Entity("e2"), new Attribute("a2"), new Entity("__"), new Entity("c2"));
        await instance.write(newDataset, (writeTx) => {
            writeTx.addStatement(statement);
            writeTx.addStatement(statement2);
            return Promise.resolve(); //TODO should find a way to remove this
        });
        await instance.write(newDataset, (writeTx) => {
            writeTx.removeStatement(statement2);
            writeTx.removeStatement(new Statement(new Entity("e2"), new Attribute("a"), "value", new Entity("c")));
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
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);

        let statement = new Statement(new Entity("e"), new Attribute("a"), "value", new Entity("c"));
        let statement2 = new Statement(new Entity("e2"), new Attribute("a2"), new Entity("__"), new Entity("c2"));
        await instance.write(newDataset, (writeTx) => {
            writeTx.addStatement(statement);
            writeTx.addStatement(statement2);
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

    it('should allow getting a Statement from a given Context', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow matching Statements in a Dataset', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow matching Statements with Literals and LiteralRanges in Datasets', async () => {
        let instance = new LigatureDexie("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset(newDataset);

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });
});
