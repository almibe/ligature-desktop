import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import settingsIcon from './assets/sliders2-vertical.svg';
import replIcon from './assets/terminal.svg';
import { bus } from './bus.ts';

export function SourcesPanel() {
  return (
    <div style="height:100%">
      <div style="width:100px; display: block; margin-left: auto;margin-right: auto;">
      <sl-button onClick={e => bus.emit("OpenSettings", "")} style="width: 50px; padding-right:5px; margin-left: auto;margin-right: auto;">
        <img src={settingsIcon} alt="Settings"  />
      </sl-button>
      <sl-button onClick={e => bus.emit("OpenRepl", "")} style="width: 45px; margin-left: auto;margin-right: auto;">
        <img src={replIcon} alt="REPL"  />
      </sl-button>
      </div>
<sl-tree>
  <sl-tree-item>
    Libs
    <sl-tree-item>Html.lib.wander</sl-tree-item>
    <sl-tree-item>
      Html.test.wander
    </sl-tree-item>
  </sl-tree-item>

  <sl-tree-item>
    Test Suite
    <sl-tree-item>Cedar</sl-tree-item>
    <sl-tree-item>Pine</sl-tree-item>
    <sl-tree-item>Spruce</sl-tree-item>
  </sl-tree-item>
</sl-tree>
</div>
  );
}

export default SourcesPanel;
