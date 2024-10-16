import '@shoelace-style/shoelace/dist/components/button/button'
import '@shoelace-style/shoelace/dist/components/button-group/button-group'
import { createSignal, onMount, Signal, For } from 'solid-js'
import { Entry, run } from '@ligature/ligature'
import { createStore } from 'solid-js/store'
import { Cell } from './Cell.tsx'

type CellModel = { 
    id: number, 
    type: "text" | "wander", 
    source: string }

let [store, modifyStore] = createStore({
    id: 0,
    cells: []
})

function newDocument() {
    modifyStore("id", () => 0)
    modifyStore("cells", () => [])
}

function openDocument() {

}

function saveDocument() {
    console.log(JSON.stringify(store.cells))
}

function printResult(result: Entry[]): string {
    let res = "{\n"
    for (let entry of result) {
        if (entry.type == "extension") {
            res += "  " + entry.element.symbol + " : " + entry.concept.symbol + ",\n"
        } else if (entry.type == "nonextension") {
            res += "  " + entry.element.symbol + " :¬ " + entry.element.symbol + ",\n"
        } else {
            res += "  " + entry.first.symbol + " " + entry.role.symbol + " " + entry.second.symbol + ",\n"
        }
    }
    return res + "}"
}

function nextId(): number {
    modifyStore("id", (id) => ++id)
    return store.id
}

function addCell() {
    modifyStore("cells", (cells) => [
        ...cells,
        {
            id: nextId(),
            type: "text",
            source: ""
        }
    ])
}

export const Editor = () => {
    return <div style="height:100%; width: 100%">
        <div style="height:100%; width: 100%">
            <sl-button-group>
                <sl-button size="small" onclick={addCell}><img src="/src/assets/icons/plus-lg.svg" alt="Add"></img></sl-button>
                <sl-button size="small" onclick={newDocument}>New</sl-button>
                <sl-button size="small" onclick={saveDocument}>Save</sl-button>
                <sl-button size="small" onclick={openDocument}>Open</sl-button>
            </sl-button-group>
            <div>
                <For each={store.cells} fallback={<div></div>}>
                    {(cell: CellModel) => (
                        <Cell id={cell.id} source={cell.source} type={cell.type}></Cell>
                    )}
                </For>
            </div>
        </div>
    </div>
}
