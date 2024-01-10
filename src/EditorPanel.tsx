
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { initializeEditor } from '@wander-lang/wander-components/wander-editor.ts';
import { onMount } from 'solid-js';
import { bus } from './bus.ts';

export function EditorPanel() {
  let editor;

  onMount(async () => {
    editor = initializeEditor("editor", "test = 5")
    bus.on("OpenRepl", e => { openRepl() });

    const tabGroup = document.querySelector('.tabs-closable');

    tabGroup.addEventListener('sl-close', async event => {
      const tab = event.target;
      const panel = tabGroup.querySelector(`sl-tab-panel[name="${tab.panel}"]`);
  
      // Show the previous tab if the tab is currently active
      if (tab.active) {
        let prev = tab.previousElementSibling
        if (prev != null) {
          tabGroup.show(tab.previousElementSibling.panel);
        }
      }
  
      // Remove the tab + panel
      tab.remove();
      panel.remove();
    });

  })

  function openRepl() {
    console.log("in open repl")
    const tabGroup = document.querySelector('.tabs-closable');
    
  }

  return (
    <div style="height:100%">
      <sl-tab-group class="tabs-closable">
        <sl-tab slot="nav" panel="closable-1" closable>test.wander</sl-tab>
        <sl-tab slot="nav" panel="closable-2" closable>Html.lib.wander</sl-tab>
        <sl-tab slot="nav" panel="closable-3" closable>Html.test.wander</sl-tab>
        <sl-tab-panel name="closable-1">
          <div class="container" style="height:100%">
            <div id="editor"  style="height:100%"></div>
          </div>

          <div class="result">
          <sl-alert variant="success" class="result" open>
            <sl-icon slot="icon" name="check2-circle"></sl-icon>
            <strong>5</strong>
          </sl-alert>
          </div>
        </sl-tab-panel>
        <sl-tab-panel name="closable-2">This is the second closable tab panel.</sl-tab-panel>
        <sl-tab-panel name="closable-3">This is the third closable tab panel.</sl-tab-panel>
      </sl-tab-group>
    </div>
  );
}

export default EditorPanel;
