import { get, writable } from "svelte/store"

export type CellModel = { 
    id: number, 
    type: "text" | "wander",
    output: string,
    source: string 
}

export const cells = writable([]) //TODO export read only version
const id = writable(0)

function nextId(): number {
    id.update((id) => ++id)
    return get(id)
}

export function newDocument() {
    throw "TODO"
}

export function addCell() {
    cells.update((cells) => [
        ...cells,
        {
            id: nextId(),
            type: "markdown",
            output: "text",
            source: "# New Cell"
        }
    ])
}

export function openDocument() {
}

export function saveDocument() {
   console.log(JSON.stringify(get(cells)))
}

export function updateType(id: number, type: "markdown" | "wander") {
    throw "TODO"
}

export function updateSource(id: number, source: string) {
    throw "TODO"
}

export function moveUp(id: number) {
    throw "TODO"
}

export function appendAfter(id: number) {
    throw "TODO"
}

export function removeCell(id: number) {
    throw "TODO"
}

export function getCells() {
    throw "TODO"
}
