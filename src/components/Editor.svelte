<script lang="ts">
import "@shoelace-style/shoelace/dist/themes/light.css"
import '@shoelace-style/shoelace/dist/components/button/button'
import '@shoelace-style/shoelace/dist/components/button-group/button-group'
import { get, writable } from 'svelte/store';

// import { Entry, run } from '@ligature/ligature'
import Cell from './Cell.svelte'

type CellModel = { 
    id: number, 
    type: "text" | "wander", 
    source: string }

// let [store, modifyStore] = createStore({
//     id: 0,
//     cells: []
// })

const id = writable(0);
const cells = writable([]);

function newDocument() {
    // modifyStore("id", () => 0)
    // modifyStore("cells", () => [])
}

function openDocument() {

}

function saveDocument() {
   console.log(JSON.stringify(get(cells)))
}

// function printResult(result: Entry[]): string {
//     let res = "{\n"
//     for (let entry of result) {
//         if (entry.type == "extension") {
//             res += "  " + entry.element.symbol + " : " + entry.concept.symbol + ",\n"
//         } else if (entry.type == "nonextension") {
//             res += "  " + entry.element.symbol + " :¬ " + entry.element.symbol + ",\n"
//         } else {
//             res += "  " + entry.first.symbol + " " + entry.role.symbol + " " + entry.second.symbol + ",\n"
//         }
//     }
//     return res + "}"
// }

function nextId(): number {
    id.update((id) => ++id)
    return get(id)
}

function addCell() {
    cells.update((cells) => [
        ...cells,
        {
            id: nextId(),
            type: "text",
            source: ""
        }
    ])
}
</script>

<div style="height:100%; width: 100%">
    <div style="height:100%; width: 100%">
        <sl-button-group>
            <sl-button size="small" onclick={addCell}><img src="/icons/plus-lg.svg" alt="Add" /></sl-button>
            <sl-button size="small" onclick={newDocument}>New</sl-button>
            <sl-button size="small" onclick={saveDocument}>Save</sl-button>
            <sl-button size="small" onclick={openDocument}>Open</sl-button>
        </sl-button-group>
        <div>
            {#each $cells as cell}
                <Cell id={cell.id} source={cell.source} type={cell.type}></Cell>
            {/each}
        </div>
    </div>
</div>

<style>

</style>
