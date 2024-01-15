import '@shoelace-style/shoelace/dist/themes/light.css';
import { Editor, initializeEditor } from '@wander-lang/wander-components/src/wander-editor.ts';
import { createSignal, onMount } from 'solid-js';
import { bus } from './bus.ts';
import { Results } from './Results.tsx';

export function ShellPanel() {
  let editor: Editor;

  onMount(async () => {
    setTimeout(() => {
      editor = initializeEditor({ 
        elementId: "editor", 
        onRun: (script) => { 
          editor.setText("")
          bus.emit("RunScript", { script });
        },
        onKey: (key, text, position) => {
          
        }
      })
    })
  })

  return (
    <div>
      <div class="container">
        <div id="editor"></div>
      </div>
      <Results />
    </div>
  );
}

export default ShellPanel;
