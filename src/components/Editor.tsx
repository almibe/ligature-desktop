import { initializeEditor } from "@ligature/ligature-components/src/editor/ligature-editor"
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
// import { runBend } from "../lib/ligature-client";

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
        // bus.on('set-editor-content', (value) => {
        //   console.log("in set-editor-content", value)
        //   editor.setText(value)
        // });
        // console.log("about to register on display-editor")
        // bus.on('diplay-editor', (value) => {
        //   console.log("on display-editor", value)
        //   console.log(editor.editorView.dom)
        // });
        // bus.on('request-content-update', () => {
        //   bus.emit('update-content', editor.readText())
        // })
      }
    );
  }

  return <>
      <div id="editorWrapper">
        <div id="editor"></div>
      </div>
  </>;
}
