<script lang="typescript">
    import { ligature } from "../store/store";
    import RemoveDatasetModal from "./modals/RemoveDatasetModal.svelte";

    let datasets: Array<Dataset> = [];
    let removeModalState = {show: false, dataset: null};

    // const unsubscribe = store.subscribe(value => {
    //     datasets = value.datasets;
    // });

//    let editDataset = (dataset: Dataset) => {
//        modalState.showEditDatasetModal(dataset)
//    }

    function removeDataset(dataset: Dataset) {
        removeModalState.dataset = dataset;
        removeModalState.show = true;
    }
</script>

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

<RemoveDatasetModal removeModalState={removeModalState} />
