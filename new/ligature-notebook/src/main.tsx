import "@shoelace-style/shoelace/dist/themes/light.css"
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel'
import { render } from "solid-js/web";
import { Files } from "./Files";
import { Editor } from "./Editor";

const App = () => {
  return <sl-split-panel id="content">
  <div
    slot="start"
    style="background: var(--sl-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    <Files></Files>
  </div>
  <div
    slot="end"
    style="background: var(--sl-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    <Editor></Editor>
  </div>
</sl-split-panel>;
};

render(App, document.querySelector("#main"));
