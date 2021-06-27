<script context="module">
	export async function preload(page, session) {
		const { datasetname } = page.params;
		return { datasetname };
	}
</script>

<script lang="typescript">
    import { onMount } from "svelte";
    import LigatureDataset from "../../components/dataset/LigatureDataset.svelte";
    import SparqlEndpoint from "../../components/dataset/SparqlEndpoint.svelte";
    import { store, Dataset } from "../../store/store";
    
    export let datasetname;

    let dataset: Dataset
    let errorMessage: String = ""
    
    onMount(() => {
        store.initialLoad()
        dataset = store.lookup(datasetname)
        if (dataset == null) {
            errorMessage = datasetname + " doesn't exist."
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
            {#if dataset != null && dataset.type == "Ligature"}
                <LigatureDataset dataset={ dataset }/>
            {:else if dataset != null && dataset.type == "SPARQL"}
                <SparqlEndpoint dataset={ dataset }/>
            {:else}
                {errorMessage}
            {/if}
        </div>
    </div>
</div>
