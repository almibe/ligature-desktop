import { writable } from 'svelte/store';

class Model {
    public datasets: Array<Dataset> = new Array();

    private storage: Storage

    public initialLoad(): Model {
        this.storage = window.localStorage;
        if (this.storage.getItem("datasets") != null) {
            const datasets = JSON.parse(this.storage.getItem("datasets"))
            this.datasets = datasets    
        }
        return this;
    }

    public addDataset(dataset: Dataset): Model {
        this.datasets.push(dataset);
        this.datasets.sort((a,b) => a.name.localeCompare(b.name.toString()))
        this.storage.setItem("datasets", JSON.stringify(this.datasets))
        return this;
    }

    public removeDataset(dataset: Dataset): Model {
        const index = this.datasets.findIndex(d => dataset.name === d.name);
        if (index > -1) {
           this.datasets.splice(index, 1);
        }
        this.storage.setItem("datasets", JSON.stringify(this.datasets))
        return this;
    }

    public clear(): Model {
        this.datasets.length = 0;
        this.storage.setItem("datasets", JSON.stringify(this.datasets))
        return this;
    }

    public lookup(datasetName: String): Dataset {
        return this.datasets.find((v) => v.name == datasetName)
    }

    public isDuplicate(datasetName: String): Boolean {
        return this.datasets.some((v) => v.name == datasetName)
    }
}

export class Dataset {
    name: String;
    type: "Ligature" | "SPARQL";
    url: String;
}

function createModel() {
    const model = new Model()
    const { subscribe, set, update } = writable(model);

    return {
        subscribe,
        addDataset: (dataset: Dataset) => update(m => m.addDataset(dataset)),
        removeDataset: (dataset: Dataset) => update(m => m.removeDataset(dataset)),
        clear: () => update(m => m.clear()),
        isDuplicate: (datasetName: String) => model.isDuplicate(datasetName),
        lookup: (datasetName: String) => model.lookup(datasetName),
        initialLoad: () => update(m => model.initialLoad())
    };
}

export const store = createModel();
