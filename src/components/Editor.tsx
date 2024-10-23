import "@shoelace-style/shoelace/dist/themes/light.css"
import '@shoelace-style/shoelace/dist/components/button/button'
import '@shoelace-style/shoelace/dist/components/button-group/button-group'
import { addCell, newDocument, openDocument, saveDocument } from "./Store";
import { createSignal, Match, Switch } from "solid-js";
import { NotebookView } from "./NotebookView";
import { NotebookEdit } from "./NotebookEdit";

let [inEditMode, setInEditMode] = createSignal(true)

let viewEditLabel = () => {
    if (inEditMode()) {
        return "View"
    } else {
        return "Edit"
    }
}

export function Editor() {
    return <div style="height:100%; width: 100%">
        <div style="height:100%; width: 100%">
            <sl-button-group>
                <sl-button size="small" onclick={addCell}><img src="../../static/icons/plus-lg.svg" alt="Add" /></sl-button>
                <sl-button size="small" onclick={() => {setInEditMode(!inEditMode())}}>{viewEditLabel}</sl-button>
                <sl-button size="small" onclick={newDocument}>New</sl-button>
                <sl-button size="small" onclick={saveDocument}>Save</sl-button>
                <sl-button size="small" onclick={openDocument}>Open</sl-button>
            </sl-button-group>
            <div>
                <Switch>
                    <Match when={inEditMode()}>
                        <NotebookEdit></NotebookEdit>
                    </Match>
                    <Match when={!inEditMode()}>
                        <NotebookView></NotebookView>
                    </Match>
                </Switch>
            </div>
        </div>
    </div>
}
