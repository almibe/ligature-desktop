import "@shoelace-style/shoelace/dist/themes/light.css"
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel'
import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

const App = () => {
  return <sl-split-panel>
  <div
    slot="start"
    style="height: 200px; background: var(--sl-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--sl-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</sl-split-panel>;
};

render(App, document.querySelector("#main"));
