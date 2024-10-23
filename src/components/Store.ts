import { open, save } from '@tauri-apps/plugin-dialog';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { open as openFile } from '@tauri-apps/plugin-fs';
import { createStore } from 'solid-js/store';

export type CellModel = {
    type: 'markdown' | 'wander',
    output: 'text' | 'table' | 'graph',
    source: string 
}

export const [store, setStore] = createStore({
    cells: []
})

export function newDocument() {
    setStore("cells", [])
}

export function addCell() {
    setStore("cells", [
        ...store.cells,
        {
            type: 'markdown',
            output: 'text',
            source: '# New Cell'
        }
    ])
}

export async function openDocument() {
    // Open a dialog
    const path = await open({
        multiple: false,
        directory: false,
    });
    const text = await readTextFile(path);
    let newCells = JSON.parse(text)
    setStore("cells", newCells.cells)
}

export async function saveDocument() {
    const doc = { cells: store.cells }
    const path = await save({
        filters: [
            {
                name: '.wander',
                extensions: ['wander']
            }
        ]
    })
    if (path != null | path != undefined) {
        await writeTextFile(path, JSON.stringify(doc))
    }
}

export function updateType(id: number, type: 'markdown' | 'wander') {
    setStore("cells", id, { type: type })
}

export function updateSource(id: number, source: string) {
    setStore("cells", id, { source: source })
}

export function moveUp(index: number) {
    if (index > 0) {
        const cells = store.cells
        const newCells = cells.slice(0, index-1).concat([cells[index]], [cells[index-1]], cells.slice(index+1, cells.length))
        setStore("cells", newCells)
    }
}

export function moveDown(index: number) {
    if (index+1 < store.cells.length) {
        const cells = store.cells
        const newCells = cells.slice(0, index).concat([cells[index+1]], [cells[index]], cells.slice(index+2, cells.length))
        setStore("cells", newCells)
    }
}

export function appendAfter(index: number) {
    const newCell = {
        type: 'markdown',
        output: 'text',
        source: '# New Cell'
    }

    setStore("cells", store.cells.slice(0, index+1).concat([newCell], store.cells.slice(index+1, store.cells.length)))
}

export function removeCell(index: number) {
    setStore("cells", store.cells.slice(0, index).concat(store.cells.slice(index+1, store.cells.length)))
}

export function lookupCell(id: number) {
    return store.cells[id]
}
