import { appendAfter, moveDown, moveUp, removeCell, updateSource, updateType } from "./Store";
import { ViewCell } from "./ViewCell";
import { Match, Switch, createSignal } from "solid-js";

// export let source: string;
// export let id: number;
// export let output: string;
// export let type: "markdown" | "wander";

const editIcon = "../../static/icons/pencil.svg"
const editText = "Edit"

const saveIcon = "../../static/icons/save.svg"
const saveText = "Save"

function selectionChange() {
    // if (markdownButton.checked) {
    //     type = "markdown"
    // } else {
    //     type = "wander"
    // }
}


export function EditCell(props: {id: string }) {

    function callEdit(editMode, setEditMode, id) {
        const mode = setEditMode(!editMode())
    
        if (!mode) {
            console.log("save!", markdownRadio.checked)

            updateSource(id, text.value)
            if (markdownRadio.checked) {
                updateType(id, "markdown")
            } else {
                updateType(id, "wander")
            }
        }
    }
    
    let text
    let markdownRadio
    const [editMode, setEditMode] = createSignal(false)
    const editSaveIcon = () => {
        if (editMode()) {
            return saveIcon
        } else {
            return editIcon
        }
    }
    const editSaveAlt = () => {
        if (editMode()) {
            return saveText
        } else {
            return editText
        }
    }

    return <div class="cell" style="border-style: solid; margin: 5px; border-width: 1px;">
        <sl-button variant="text" size="small" onclick={() => callEdit(editMode, setEditMode)}><img src={editSaveIcon()} alt={editSaveAlt()} /></sl-button>
        <sl-button variant="text" size="small" onclick={() => {moveUp(props.id)}}><img src="../../static/icons/arrow-up.svg" alt="Move Cell Up" /></sl-button>
        <sl-button variant="text" size="small" onclick={() => {moveDown(props.id)}}><img src="../../static/icons/arrow-down.svg" alt="Move Cell Down" /></sl-button>
        <sl-button variant="text" size="small" onclick={() => {appendAfter(props.id)}}><img src="../../static/icons/journal-plus.svg" alt="Append New Cell" /></sl-button>
        <sl-button variant="text" size="small" onclick={() => {removeCell(props.id)}}><img src="../../static/icons/journal-minus.svg" alt="Remove Cell" /></sl-button>
        <Switch>
            <Match when={editMode()}>
                <div>
                    <div>
                        <input ref={markdownRadio} type="radio" name={"cellType" + props.id} value="markdown" checked />
                        <label for={"cellType" + props.id}>MarkDown</label>
                        <input type="radio" name={"cellType" + props.id} value="wander" />
                        <label for={"cellType" + props.id}>Wander</label>
                    </div>
                    <textarea ref={text}></textarea>
                </div>
            </Match>
            <Match when={!editMode()}>
                <ViewCell></ViewCell>
            </Match>
        </Switch>
    </div>
}
