'use strict';

import { InMemoryLigature } from '../lib';
import { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';

describe('Datasets Support', () => {
    it('should open and close cleanly', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        let ds = await instance.allDatasets();
        expect(ds.length).to.be.equal(0);
        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow creating new datasets', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");
        let datasets = await instance.allDatasets();
        expect(datasets.length).to.be.equal(1);
        expect(datasets[0].dataset).to.be.equal("newDataset");
        await instance.close(true);
        expect(instance.isOpen()).to.be.false;        
    });

    it('should allow checking if dataset exists', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");
        let testExists = await instance.datasetExists("test")
        expect(testExists).to.be.false;
        let newDatasetExists = await instance.datasetExists("newDataset")
        expect(newDatasetExists).to.be.true;
        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow finding Datasets by prefix', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        //TODO add additional Datasets and test match function
        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow finding Datasets by range', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        //TODO add additional Datasets and test match by range function
        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow deleting a Dataset', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        //TODO add additional Datasets and test deleting
        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });
});

describe('Statement Support', () => {
    it('should create new Datasets with zero Statements', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow generating new Entities that are prefixed UUIDs', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should alllow adding Statements to a Dataset', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow removing Statements from a Dataset', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow canceling a WriteTx', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow getting a Statement from a given Context', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow matching Statements in a Dataset', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow matching Statements with Literals and LiteralRanges in Datasets', async () => {
        let instance = new InMemoryLigature("test-" + uuidv4());
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");

        expect("write actual test").to.be.true;

        await instance.close(true);
        expect(instance.isOpen()).to.be.false;
    });
});
