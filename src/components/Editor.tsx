import { initializeEditor } from "@ligature/ligature-components/src/editor/ligature-editor"
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";

let editor = null;

export function Editor() {
  const store = useContext(StoreContext);

  createEffect(() => {
    if (store.state.editMode) {
      editor.setText(store.state.bodyContent)
      document.querySelector("#editorWrapper").hidden = false
    } else {
      if (editor != null) {
        store.setBodyContent(editor.readText())
      }
      document.querySelector("#editorWrapper").hidden = true
    }
  })

  if (editor == null) {
    setTimeout(() => {
        const element = document.querySelector("#editor")
        editor = initializeEditor({
          element,
          onRun: async (script) => {
            // const res = await runBend(script)
            // props.setResults(res)
          },
          onChange: (script) => {
            // props.setEditorContent(script)
          }
        })
      }
    );
  }

  return <>
      <div id="editorWrapper">
        <div id="editor"></div>
      </div>
  </>;
}
