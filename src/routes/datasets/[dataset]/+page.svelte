<script lang="ts">
    import { page } from '$app/stores';
    import Dataset from "@ligature/ligature-components/Dataset.svelte";
    import { invoke } from "@tauri-apps/api/tauri";

    let datasetName = $page.params.dataset;
    let resultText = "";

    async function runQuery(event) {
        resultText = await invoke("run_query", { dataset: datasetName, input: event.detail } );
    }

    async function runInsert(event) {
        resultText = await invoke("run_insert", { dataset: datasetName, input: event.detail });
    }

    async function runRemove(event) {
        resultText = await invoke("run_remove", { dataset: datasetName, input: event.detail });
    }
</script>

<Dataset 
    {datasetName}
    {resultText}
    on:runInsert="{runInsert}"
    on:runQuery="{runQuery}"
    on:runRemove="{runRemove}"></Dataset>
