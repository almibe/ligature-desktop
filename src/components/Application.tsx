import { onMount } from "solid-js"
import Split from "split.js"
import { showEditor } from "@ligature/ligature-components/src/editor/editor"
import { run as runScript } from "@ligature/ligature"
import { EditorView } from "codemirror";


export function Application() {
    let editor: EditorView = null;
    onMount(() => {
        Split(["#top", "#results"], { direction: "vertical"})
        editor = showEditor("#editor")
    })

    function run() {
        console.log(runScript(editor.state.doc.toString()))
    }
    
    return <div style="height:100%; width: 100%">
        <div id="top">
            <div>
                <button onclick={run}><img src="../../static/icons/play.svg" alt="Add" /></button>
            </div>
            <div id="editor"></div>
        </div>
        <div id="results">
            Results
        </div>
    </div>
}
