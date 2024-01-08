
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

export function Editor() {
  return (
    <div style="height:100%">
      <sl-tab-group class="tabs-closable">
        <sl-tab slot="nav" panel="closable-1" closable>test.wander</sl-tab>
        <sl-tab slot="nav" panel="closable-2" closable>Html.lib.wander</sl-tab>
        <sl-tab slot="nav" panel="closable-3" closable>Html.test.wander</sl-tab>

        <sl-tab-panel name="closable-1">
          <sl-tooltip placement="top-start" trigger="click">
            <div slot="content">I'm not <strong>just</strong> a tooltip, I'm a <em>tooltip</em> with HTML!</div>
            <div class="container">
              <div id="editor"></div>
            </div>
          </sl-tooltip>
        </sl-tab-panel>
        <sl-tab-panel name="closable-2">This is the second closable tab panel.</sl-tab-panel>
        <sl-tab-panel name="closable-3">This is the third closable tab panel.</sl-tab-panel>
      </sl-tab-group>
    </div>
  );
}

export default Editor;
