<script lang="typescript">
    import DatasetModal from "./modals/DatasetModal.svelte";
    import RemoveDatasetModal from "./modals/RemoveDatasetModal.svelte";
    import { ligature } from '../store/store';
    import { onMount } from 'svelte';

    onMount(async () => {
        await updateDatasets();
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

    let datasets: Array<Dataset> = [];
    let removeModalState = {show: false, dataset: null};

    async function updateDatasets() {
        datasets = await $ligature.allDatasets();
    }

    function removeDataset(dataset: Dataset) {
        removeModalState.dataset = dataset;
        removeModalState.show = true;
    }
</script>

<div class="row">
    <div class="col-sm-auto">
        <h2>Datasets</h2>
    </div>
    <div class="col-sm">
        <button type="button" class="btn btn-outline-dark" id="newDataset" on:click={addDataset}>Add Dataset</button>
        <button type="button" class="btn btn-outline-dark" id="newDataset" on:click={updateDatasets}>Refresh List</button>
    </div>
</div>

<table class="table table-striped table-hover">
    <thead>
        <tr>
            <th>Name</th>
            <!--<th>Type</th>-->
            <!--<th>Endpoint</th>-->
            <th></th>
        </tr>
    </thead>
    <tbody>
        { #each datasets as dataset }
        <tr>
            <td class="pt-4"><a class="link-dark" href="dataset/{dataset.name}">{dataset.name}</a></td>
            <!-- <td class="pt-4">{dataset.type}</td> -->
            <!-- <td class="pt-4">{dataset.url}</td> -->
            <td>
                <!-- <button type="button" class="btn btn-outline-dark" on:click={() => editDataset(dataset)}>Edit</button> -->
                <button type="button" class="btn btn-outline-danger" on:click={() => removeDataset(dataset)}>Remove</button>
            </td>
        </tr>
        { /each }
    </tbody>
</table>

<DatasetModal {...modalProperties} on:updateDatasets={updateDatasets} />
<RemoveDatasetModal removeModalState={removeModalState} on:updateDatasets={updateDatasets} />
