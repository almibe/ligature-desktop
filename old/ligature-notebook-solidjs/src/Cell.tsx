import { createSignal } from "solid-js"

export function DisplayCell(props) {
    return <div><em>Empty Cell</em></div>
}

export function Cell(props) {
    let [editting, setEditting] = createSignal(false)
    let source = props.source

    return <div class="cell">
        <sl-button variant="text" size="small" onclick={() => {setEditting(!editting())}}><img src="/src/assets/icons/pencil.svg" alt="Edit" /></sl-button>
        <sl-button variant="text" size="small"><img src="/src/assets/icons/arrow-up.svg" alt="Move Cell Up" /></sl-button>
        <sl-button variant="text" size="small"><img src="/src/assets/icons/arrow-down.svg" alt="Move Cell Down" /></sl-button>
        <sl-button variant="text" size="small"><img src="/src/assets/icons/journal-plus.svg" alt="Append New Cell" /></sl-button>
        <sl-button variant="text" size="small"><img src="/src/assets/icons/journal-minus.svg" alt="Remove Cell" /></sl-button>
        <Show when={editting()} fallback={<DisplayCell></DisplayCell>}>
            <div>
                <textarea>{source}</textarea>
            </div>
        </Show>
    </div>

    // if (props.type == "text") {
    //     if (editting) {
    //         return <div id={"cell" + props.id}>
    //             <textarea>{props.source}</textarea>
    //         </div>
    //     } else {
    //         return <div>{props.source}</div>
    //     }

    // } else {
    //     return <div>TODO</div>
    // }
}
