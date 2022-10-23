<script lang="ts">
  import Datasets from "@ligature/ligature-components/Datasets.svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import { goto } from '$app/navigation';

  let datasets: Array<string> = [];
  
  async function addDataset(event: {detail: string}) {
    await invoke("add_dataset", { name: event.detail });
  }

  async function removeDataset(event: {detail: string}) {
    await invoke("remove_dataset", { name: event.detail });
  }

  function openDataset(event: {detail: string}) {
    goto(`/datasets/${event.detail}/`);
  }

</script>

<Datasets 
  {datasets} 
  on:addDataset="{addDataset}" 
  on:removeDataset="{removeDataset}"
  on:openDataset="{openDataset}"></Datasets>
