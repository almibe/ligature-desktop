'use strict';

import { InMemoryLigature } from '../lib';
import { expect } from 'chai';

describe('Datasets Support', () => {
    it('should open and close cleanly', async () => {
        let instance = new InMemoryLigature("test1");
        expect(instance.isOpen()).to.be.true;
        let ds = await instance.allDatasets();
        expect(ds.length).to.be.equal(0);
        await instance.close();
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow creating new datasets', async () => {
        let instance = new InMemoryLigature("test2");
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");
        let datasets = await instance.allDatasets();
        expect(datasets.length).to.be.equal(1);
        expect(datasets[0].dataset).to.be.equal("newDataset");
        await instance.close();
        expect(instance.isOpen()).to.be.false;        
    });

    it('should allow checking if dataset exists', async () => {
        let instance = new InMemoryLigature("test3");
        expect(instance.isOpen()).to.be.true;
        await instance.createDataset("newDataset");
        let testExists = await instance.datasetExists("test")
        expect(testExists).to.be.false;
        let newDatasetExists = await instance.datasetExists("newDataset")
        expect(newDatasetExists).to.be.true;
        await instance.close();
        expect(instance.isOpen()).to.be.false;
    });

    it('should allow finding Datasets by prefix')

    it('should allow finding Datasets by range')

    it('should allow delting a Dataset')
});

describe('Statement Support', () => {
    it('should create new Datasets with zero Statements')

    it('should allow generating new Entities that are prefixed UUIDs')

    it('should alllow adding Statements to a Dataset')

    it('should allow removing Statements from a Dataset')

    it('should allow canceling a WriteTx')

    it('should allow getting a Statement from a given Context')

    it('should allow matching Statements in a Dataset')

    it('should allow matching Statements with Literals and LiteralRanges in Datasets')
});
