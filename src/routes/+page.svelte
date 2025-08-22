<script lang="ts">
  import { printResult, runScript, showEditor } from '@ligature/ligature-components'
  import './style.css'
  import { onMount } from 'svelte';
  import '@shoelace-style/shoelace/dist/shoelace.js'
  import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js'
  import '@shoelace-style/shoelace/dist/components/select/select.js'
  import '@shoelace-style/shoelace/dist/themes/light.css'
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { event, window, path } from '@tauri-apps/api'
  import { save, open } from '@tauri-apps/plugin-dialog';

  let fileName: string | null = $state(null)

  let editor: any | null = null;

  $effect(() => {
    if (fileName == null) {
      window.getCurrentWindow().setTitle("Ligature Desktop - New Script")
    } else {
      window.getCurrentWindow().setTitle("Ligature Desktop - " + fileName)
    }
	});

  function newScript() {
    fileName = null
    document.querySelector("#result").innerHTML = ""
    document.querySelector("#output").innerHTML = ""
    editor.setValue("")
  }

  function run() {
      document.querySelector("#result").innerHTML = ""
      document.querySelector("#output").innerHTML = ""
      let res = printResult(runScript(editor.getValue(), document.querySelector("#output")))
      document.querySelector("#result").innerHTML = res
  }

  async function openScript() {
    const selectedFile = await open({
      multiple: false,
      directory: false,
    });
    fileName = selectedFile
    console.log(selectedFile);
  }

  async function saveScript() {

  }

  async function saveAsScript() {
    const path = await save({
      filters: [
        {
          name: 'Wander Files',
          extensions: ['wander'],
        },
      ],
    });
    console.log(path);
  }

  onMount(() => {
    listen(
      'set_editor',
      (event) => {
        editor.setValue(event.payload)
      }
    )

    editor = showEditor(document.querySelector("#editor"))

    invoke("start_up")
  })
</script>

<div id="main">
  <sl-button-group>
    <sl-button id="newButton" onclick={newScript}>New</sl-button>
    <sl-button id="openButton" onclick={openScript}>Open</sl-button>
    <sl-button id="saveButton" onclick={saveScript}>Save</sl-button>
    <sl-button id="saveAsButton" onclick={saveAsScript}>Save As</sl-button>
  </sl-button-group>
  <sl-button-group>
    <sl-button id="runButton" onclick={run}>Run</sl-button>
  </sl-button-group>

      <sl-split-panel class="main" position="65" vertical>
        <div
          slot="start"
          style="overflow: scroll"
        >
          <div id="topPanel">
            <div id="editor">docs()</div>
          </div>
        </div>
        <div
          slot="end"
          style="overflow: scroll"
        >
          <div id="output"></div>
          <pre><code id="result"></code></pre>
        </div>
      </sl-split-panel>

</div>

<style>
</style>
