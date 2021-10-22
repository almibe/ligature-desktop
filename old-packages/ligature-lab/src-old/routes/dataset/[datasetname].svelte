<script context="module">
	export async function load({page}) {
        return { props: { datasetname: page.params.datasetname } };
	}
</script>

<script lang="typescript">
    import { onMount } from "svelte";
    import LigatureDataset from "../../components/dataset/LigatureDataset.svelte";
    import { ligature } from "../../store/store";
    import { Dataset } from "@ligature/ligature";
    
    export let datasetname;

    let dataset: Dataset | null = null
    let errorMessage: String = ""
    
    onMount(async () => {
        dataset = new Dataset(datasetname);

        if(dataset.isValid()) {
            let datasetExists = await $ligature.datasetExists(dataset);
            console.log(datasetExists);
            if (!datasetExists) {
                dataset = null;
                errorMessage = datasetname + " doesn't exist."
            }
        } else {
            dataset = null;
            errorMessage = "Invalid Dataset name.";
        }
    })
</script>

<svelte:head>
    <title>Ligature Lab/{datasetname}</title>
</svelte:head>

<div class="container">
    <div class="row p-4">
        <div class="col-sm-auto">
            <h1>Ligature Lab/{datasetname}</h1>
        </div>
        <div class="col-sm-auto">
            <p style="float:right"><a href="../..">Back</a></p>
        </div>
    </div>
    <div class="row">
        {#if dataset != null }
            <LigatureDataset dataset={ dataset }/>
        {:else}
            <p>{errorMessage}</p>
        {/if}
    </div>
</div>
