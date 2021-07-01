<script lang="typescript">
    import DatasetModal from "./modals/DatasetModal.svelte";
    import DatasetList from "./DatasetList.svelte";
    import { ligature } from '../store/store';
    import { onMount } from 'svelte';

    onMount(() => {
        //store.initialLoad();
    })

    const modalProperties = {
        show: false,
        title: "",
        datasetName: ""
    }

    let addDataset = () => {
        modalProperties.title = "Add new Dataset";
        modalProperties.show = true;
        modalProperties.datasetName = "";
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
<DatasetModal {...modalProperties} />
