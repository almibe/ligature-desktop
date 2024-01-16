import '@shoelace-style/shoelace/dist/themes/light.css';
import { Editor, initializeEditor } from '@wander-lang/wander-components/src/wander-editor.ts';
import { createSignal, onMount } from 'solid-js';
import { bus } from './bus.ts';
import { Results } from './Results.tsx';

export function ShellPanel() {
  let editor: Editor;

  bus.on("ClearEditor", () => {
    editor.setText("");
  })

  onMount(async () => {
    setTimeout(() => {
      editor = initializeEditor({ 
        elementId: "editor", 
        onRun: (script) => {
          editor.setText("")
          bus.emit("RunScript", { script });
        },
        onKey: (key, script, position) => {
          if (key == "Enter") {
            bus.emit("RunScript", { script });
            setTimeout(() => editor.setText(""))
          }
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
