<script lang="ts">
  import { runScript, showEditor } from '@ligature/ligature-components'
  import './style.css'
  import { onMount } from 'svelte';
  import '@shoelace-style/shoelace/dist/shoelace.js'
  import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js'
  import '@shoelace-style/shoelace/dist/themes/light.css'

  onMount(() => {
    let initalScript = 
`{ display table 
  network (assertions [a b c] [a d e] [w e e])}`

    let editor = showEditor(document.querySelector("#editor"), initalScript)

    document.querySelector("#runButton")?.addEventListener("click", () => {
      document.querySelector("#results").innerHTML = ""
      runScript(editor.state.doc.toString(), document.querySelector("#results"))
    })
  })
</script>

<main class="container">

  <sl-split-panel position="25">
    <div
      slot="start"
      style=""
    >
      <div id="sidebar">Sidebar</div>
    </div>
    <div
      slot="end"
      style=""
    >
      <div><button id="runButton">Run</button></div>
      <div id="editor"></div>
      <div id="results"></div>
    </div>
  </sl-split-panel>
</main>

<style>
</style>
