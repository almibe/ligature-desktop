<script lang="ts">
  import { runScript, showEditor } from '@ligature/ligature-components'
  import './style.css'
  import { onMount } from 'svelte';
  import '@shoelace-style/shoelace/dist/shoelace.js'
  import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js'
  import '@shoelace-style/shoelace/dist/themes/light.css'
  import SideBar from '../components/SideBar.svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  
  let files = $state([])

  onMount(() => {
    listen(
      'add_file',
      (event) => {
        files.push(event.payload)
      }
    );

    listen(
      'set_editor',
      (event) => {
        editor.setValue(event.payload)
      }
    )

    let initalScript = `(docs)`

    let editor = showEditor(document.querySelector("#editor"), initalScript)

    document.querySelector("#runButton")?.addEventListener("click", () => {
      document.querySelector("#results").innerHTML = ""
      runScript(editor.getValue(), document.querySelector("#results"))
    })

    invoke("start_up")
  })
</script>

<sl-split-panel position="25" class="main">
  <div
    slot="start"
    style="overflow: scroll"
  >
    {#each files as file}
      <div><sl-button variant="text" size="medium" on:click={() => {
        invoke("open_file", {name: file})
      }}>{file}</sl-button></div>
    {/each}
  </div>
  <div
    slot="end"
    style="overflow: scroll"
  >
    <sl-split-panel class="main" position="65" vertical>
      <div
        slot="start"
        style="overflow: scroll"
      >
      <div id="topPanel">
        <div><sl-button id="runButton">Run</sl-button></div>
        <div id="editor"></div>
      </div>
    </div>
      <div
        slot="end"
        style="overflow: scroll"
      >
        <div id="results"></div>
      </div>
    </sl-split-panel>
    </div>
</sl-split-panel>

<style>
</style>
