import { initializeEditor } from "@ligature/ligature-components/src/editor/ligature-editor"
import { runBend } from "../lib/ligature-client";

export function Editor(props) {
  setTimeout(() => {
    initializeEditor({
      element: document.querySelector("#editor"),
      onRun: async (script) => {
        const res = await runBend(script)
        props.setResults(res)
      },
      onChange: (script) => {
        props.setEditorContent(script)
      }
    })      
  });

  return <>
      <div id="editor"></div>
  </>;
}
