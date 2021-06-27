import { writable } from 'svelte/store';
import type { Dataset } from "./store";

class ModalState {
    show: Boolean = false;
    title: String = "";
    dataset: null | Dataset = null;

    showNewDatasetModal(): ModalState {
        this.title = "Add New Dataset"
        this.dataset = null
        this.show = true
        return this
    }

    showEditDatasetModal(dataset: Dataset): ModalState {
        this.title = "Edit " + dataset.name
        this.dataset = dataset
        this.show = true
        return this;
    }

    hide(): ModalState {
        this.dataset = null;
        this.title = ""
        this.show = false;
        return this;
    }
}

function create() {
    const modalState = new ModalState();
    const { subscribe, update } = writable(modalState);

    return {
        subscribe,
        showNewDatasetModal: () => update(m => m.showNewDatasetModal()),
        showEditDatasetModal: (dataset: Dataset) => update(m => m.showEditDatasetModal(dataset)),
        hide: () => update(m => m.hide()),
        dataset: () => modalState.dataset
    };
}

export const modalState = create();
