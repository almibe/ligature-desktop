<script lang="ts">
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import "@shoelace-style/shoelace/dist/components/button-group/button-group.d.ts";
  import {EditorView, basicSetup} from "codemirror";
  import {javascript} from "@codemirror/lang-javascript";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let inputEditor: EditorView = null;

  async function runWander() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    let script = inputEditor.state.doc.toString();
    let results = await invoke("run_wander", { input: script })
    dispatch('results', { results: results })
    console.log(results)
  }

  onMount(async () => {
    const editorNode = document.getElementById("input")!!;
    inputEditor = new EditorView({
            extensions: [
                EditorView.domEventHandlers({
                    keydown: e => {
                        if((e.code == "Enter") && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            runWander();
                        }
                    }
                }),
                basicSetup, 
                javascript()
            ],
            parent: editorNode
        });
    inputEditor.focus();
  })
</script>

<div style="width: 98%">
  <sl-button on:click={runWander}>Run</sl-button>
  <div>
    <div id="input"></div>
  </div>
</div>

<style>
  #input {
    height:300px;
    resize: vertical;
    overflow:scroll;
  }
</style>
