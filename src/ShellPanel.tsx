import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { initializeEditor } from '@wander-lang/wander-components/src/wander-editor.ts';
import { createSignal, onMount } from 'solid-js';
import { bus } from './bus.ts';
import { printResult, run } from '@wander-lang/wander/src/interpreter.ts';

export function ShellPanel() {
  let editor;
  const [results, setResults] = createSignal([]);

  onMount(async () => {
    console.log("in onMount")
    setTimeout(() => {
      editor = initializeEditor({ elementId: "editor", onRun: (script) => { 
        let newResult = { text: printResult(run(script, {})) }
        setResults([newResult, ...results()])
        console.log(script) 
      }})
    })
  })

  return (
    <div>
      <div class="container">
        <div id="editor"></div>
      </div>

      <For each={results()}>{(result, i) =>
        <div class="result">
          <sl-alert variant="success" class="result" open>
            <sl-icon slot="icon" name="check2-circle"></sl-icon>
            <strong>{result.text}</strong>
          </sl-alert>
        </div>
      }
      </For>
    </div>
  );
}

export default ShellPanel;
