<script lang="ts">
    import { page } from '$app/stores';
    import Dataset from "@ligature/ligature-components/Dataset.svelte";
    import { invoke } from "@tauri-apps/api/tauri";
	import { onMount } from 'svelte';


    let datasetName = $page.params.dataset;
    let resultText = "";

    function runQuery(event) {
        console.log("runQuery - " + event.detail);
    }

    function runInsert(event) {
        console.log("runInsert - " + event.detail);
    }

    function runRemove(event) {
        console.log("runRemove - " + event.detail);
    }
</script>

<Dataset 
    {datasetName}
    {resultText}
    on:runInsert="{runInsert}"
    on:runQuery="{runQuery}"
    on:runRemove="{runRemove}"></Dataset>
