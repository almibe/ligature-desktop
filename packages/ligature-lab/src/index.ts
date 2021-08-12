import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import { openLigatureSimpleIndexedDB } from '@ligature/ligature-indexeddb/lib/simple'
import { WanderInterpreter, write } from "@ligature/wander"
import { Text } from "@codemirror/text";

const interpreter = new WanderInterpreter()

const instance = openLigatureSimpleIndexedDB("ligature-lab")

let view = new EditorView({
  state: EditorState.create({extensions: [basicSetup]}),
  parent: document.getElementById('editor') as Element
})

const runButton = document.getElementById("run") as HTMLButtonElement
runButton.addEventListener("click", () => run());

const output = document.getElementById("output") as HTMLDivElement

function run() {
  let script = view.state.doc.toJSON().reduce((t, l) => `${t}\n${l}`)
  let result = interpreter.run(script)
  output.innerText = write(result)
}
