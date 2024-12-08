import { createSignal, onMount } from "solid-js"
import { showEditor } from "@ligature/ligature-components/src/editor/editor"
import { run as runScript } from "@ligature/ligature"
import { EditorView } from "codemirror";
import Split from 'split-grid'

export function Application() {
    let [resultText, setResultText] = createSignal("")
    let editor: EditorView = null;
    onMount(() => {
        Split({
            rowGutters: [{
                track: 1,
                element: document.querySelector('.gutter-row-1'),
            }]
        })
        editor = showEditor(document.querySelector("#editor"), "")
    })

    function run() {
        let result = runScript(editor.state.doc.toString())
        setResultText(JSON.stringify(result))
    }
    
    return <div style="height:100%; width: 100%">
        <div class="grid" style="height:100%; width: 100%">
            <div id="top" style="overflow: auto">
                <div>
                    <button onclick={run}><img src="../../static/icons/play.svg" alt="Add" /></button>
                </div>
                <div id="editor"></div>
            </div>
            <div class="gutter-row gutter-row-1"></div>
            <div id="results" style="overflow: auto">
                {resultText}
            </div>
        </div>
    </div>
}
