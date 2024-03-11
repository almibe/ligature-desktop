import { initializeEditor } from "@ligature/ligature-components/src/editor/ligature-editor"
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";

export function Editor() {
  let editor = null;
  const store = useContext(StoreContext);

  createEffect(() => {
    if (store.state.mode == "Edit") {
      editor.setText(store.state.bodyContent)
      document.querySelector("#editorWrapper").hidden = false
    } else {
      document.querySelector("#editorWrapper").hidden = true
    }
  })

  if (editor == null) {
    setTimeout(() => {
        const element = document.querySelector("#editor")
        editor = initializeEditor({
          element,
          onRun: async (script) => {
            //do nothing
          },
          onChange: (script) => {
            store.setEditorContent(script)
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
