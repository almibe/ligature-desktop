import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import icon from './assets/sliders2-vertical.svg';

export function Sources() {
  return (
    <div style="height:100%">
      <sl-button style="display: block; width: 45px; margin-left: auto;margin-right: auto;">
        <img src={icon} alt="Settings" width="15" height="15" />
      </sl-button>
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

export default Sources;
