import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { initializeEditor } from '@wander-lang/wander-components/wander-editor.ts';
import { Sources } from "./Sources.tsx";
import { Editor } from "./Editor.tsx";
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';

function App() {
  const [result, setResult] = createSignal("");
  const [script, setScript] = createSignal("");
  let editor = null;
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setResult(await invoke("run", { script: script() }));
  }

  onMount(async () => {
    editor = initializeEditor("editor", "test = 5")
  })

  return (
    <sl-split-panel id="main">
  <div 
    slot="start"
    style="height: 100%; background: var(--sl-color-neutral-50);">
    <Sources />
  </div>
  <div slot="end">
    <Editor />
  </div>
</sl-split-panel>
  );
}

export default App;
