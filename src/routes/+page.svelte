<script lang="ts">
  import { runScript, showEditor } from '@ligature/ligature-components'

import './style.css'
    import { onMount } from 'svelte';

// let initalScript = `
// { display canvas 
//   width 200 
//   height 200 
//   instructions [
//     [fill-style blue]
//     [fill-rect 10 10 150 100]]}`

onMount(() => {
  let initalScript = `
{ display table 
  network (assertions [a b c] [a d e] [w e e])}`

let editor = showEditor(document.querySelector("#editor"), initalScript)

document.querySelector("#runButton")?.addEventListener("click", () => {
    document.querySelector("#results").innerHTML = ""
    runScript(editor.state.doc.toString(), document.querySelector("#results"))
})

})

</script>

<main class="container">
  <div><button id="runButton">Run</button></div>
  <div id="editor"></div>
  <div id="results"></div>
</main>

<style>
</style>
