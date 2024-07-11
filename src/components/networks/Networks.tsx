import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import { For, useContext } from 'solid-js';
import { StoreContext } from '../StoreProvider';

export function Networks() {
  const store = useContext(StoreContext)

  return <div>
    <sl-button id="addNetwork">+</sl-button>
    <sl-tree>
      <sl-tree-item selected>Wander</sl-tree-item>
      <For each={store.state.networks}>
        {(network, _index) => <sl-tree-item>{network}</sl-tree-item>}
      </For>
    </sl-tree>
  </div>
}
