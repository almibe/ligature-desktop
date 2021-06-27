<script lang="typescript">
    import DatasetModal from "./modals/DatasetModal.svelte";
    import DatasetList from "./DatasetList.svelte";
    import { store } from '../store/store';
    import { modalState } from '../store/modalState';
    import { onMount } from 'svelte';

    onMount(() => {
        store.initialLoad();
    })

    let addDataset = () => {
        modalState.showNewDatasetModal()
    }
</script>

<div class="row">
    <div class="col-sm-auto">
        <h2>Datasets</h2>
    </div>
    <div class="col-sm">
        <button type="button" class="btn btn-outline-dark" id="newDataset" on:click={addDataset}>Add Dataset</button>
    </div>
</div>

<DatasetList />
<DatasetModal />
