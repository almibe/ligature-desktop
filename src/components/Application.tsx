import { createSignal, onMount } from "solid-js"
import { showEditor } from "@ligature/ligature-components/src/editor/editor"
import { readValue } from "@ligature/ligature"
import { runWander } from "../lib/ligature-client"
import { EditorView } from "codemirror";
import { showText } from "@ligature/ligature-components/src/text/text"
import { showGraph } from "@ligature/ligature-components/src/graph/graph"
import Split from 'split-grid'

export function Application() {
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

    async function run() {
        let result = await runWander(editor.state.doc.toString())
        let value = readValue(result)
        showText(document.querySelector("#results"), value)
        //showGraph(document.querySelector("#results"), value)
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
            </div>
        </div>
    </div>
}
