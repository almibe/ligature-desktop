'use strict';

import { InMemoryLigature } from '../lib';
import { toArray, take } from 'rxjs/operators';

test('create and close store', done => {
    let instance = new InMemoryLigature();
    expect(instance.isOpen()).toBe(true);
    instance.allDatasets()
        .pipe(toArray())
        .subscribe((datasets) => {
            expect(datasets.length).toBe(0);
            done();
        });
    instance.close();
    expect(instance.isOpen()).toBe(false);
});

test('create new dataset', done => {
    let instance = new InMemoryLigature();
    expect(instance.isOpen()).toBe(true);
    instance.createDataset("newDataset");
    instance.allDatasets()
        .pipe(toArray())
        .subscribe((datasets) => {
            expect(datasets.length).toBe(1);
            expect(datasets[0]).toBe("newDataset")
            done();
        });
    instance.close();
    expect(instance.isOpen()).toBe(false);
});

test('check if dataset exists', done => {
    let instance = new InMemoryLigature();
    expect(instance.isOpen()).toBe(true);
    instance.createDataset("newDataset");

    instance.datasetExists("test").pipe(toArray()).subscribe(res => { expect(res[0]).toBe(false) });
    instance.datasetExists("newDataset").pipe(toArray()).subscribe(res => { expect(res[0]).toBe(true); done(); });

    instance.close();
    expect(instance.isOpen()).toBe(false);
});

