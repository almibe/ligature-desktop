import { writable } from 'svelte/store';
import { LigatureDexie } from '@ligature/ligature-indexeddb';
import { Dataset } from '@ligature/ligature';
export { Dataset };

class Model {
    public datasets: Array<Dataset> = new Array();
    private storage: LigatureDexie

    public async initialLoad(): Promise<Model> {
        this.storage = new LigatureDexie("ligature-lab");
        // if (this.storage.getItem("datasets") != null) {
        //     const datasets = JSON.parse(this.storage.getItem("datasets"))
        //     this.datasets = datasets    
        // }
        await this.reloadDatasets()
        return this;
    }

    private async reloadDatasets() {
        this.datasets = await this.storage.allDatasets() //TODO might need to remove all old ds/add new ones
    }

    public async addDataset(dataset: Dataset): Promise<Model> {
        console.log("a")
        await this.storage.createDataset(dataset);
        console.log("b")
        await this.reloadDatasets();
        console.log("c")
        return this;
    }

    public async removeDataset(dataset: Dataset): Promise<Model> {
        await this.storage.deleteDataset(dataset);
        await this.reloadDatasets();
        return this;
    }

    // public clear(): Model {
    //     this.datasets.length = 0;
    //     this.storage.setItem("datasets", JSON.stringify(this.datasets))
    //     return this;
    // }

    // public lookup(datasetName: String): Dataset {
    //     return this.datasets.find((v) => v.name == datasetName)
    // }

    // public isDuplicate(datasetName: String): Boolean {
    //     return this.datasets.some((v) => v.name == datasetName)
    // }
}

// export class Dataset {
//     name: String;
//     type: "Ligature" | "SPARQL";
//     url: String;
// }

function createModel() {
    const model = new Model()
    const { subscribe, set, update } = writable(model);

    return {
        subscribe,
        addDataset: async (dataset: Dataset) => {
            await model.addDataset(dataset)
            update(m => m) //TODO this probably isn't right
        },
        removeDataset: async (dataset: Dataset) => {
            await model.removeDataset(dataset);
            update(m => m) //TODO this probably isn't right
        },
        //clear: () => update(m => m.clear()),
        //isDuplicate: (datasetName: String) => model.isDuplicate(datasetName),
        //lookup: (datasetName: String) => model.lookup(datasetName),
        initialLoad: async () => {
            await model.initialLoad()
            update(m => m) //TODO this is probably wrong
        }
    };
}

export const store = createModel();
