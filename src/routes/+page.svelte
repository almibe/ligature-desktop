<script lang="ts">
  import Datasets from "@ligature/ligature-components/Datasets.svelte";
  import { invoke } from "@tauri-apps/api/tauri";
	import { onMount } from 'svelte';

  let datasets: Array<string> = [];
  
  async function addDataset(event: {detail: string}) {
    await invoke("add_dataset", { name: event.detail });
    refreshDatasets();
  }

  async function removeDataset(event: {detail: string}) {
    await invoke("remove_dataset", { name: event.detail });
    refreshDatasets();
  }

  async function openDataset(event: {detail: string}) {
    window.location = `/datasets/${event.detail}/`;
  }

  async function refreshDatasets() {
    datasets = await invoke("all_datasets", {});
  }

  onMount(async () => {
		refreshDatasets();
	});
</script>

<Datasets 
  {datasets} 
  on:addDataset="{addDataset}" 
  on:removeDataset="{removeDataset}"
  on:openDataset="{openDataset}"></Datasets>
