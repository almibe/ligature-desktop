import { get, writable } from 'svelte/store'
import { open, save } from '@tauri-apps/plugin-dialog';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { open as openFile } from '@tauri-apps/plugin-fs';

export type CellModel = { 
    id: number, 
    type: 'markdown' | 'wander',
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
    cells.set([])
    id.set(0)
}

export function addCell() {
    cells.update((cells) => [
        ...cells,
        {
            id: nextId(),
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
    console.log(path);
    console.log(await exists(path))
    const text = await readTextFile(path);
    console.log(text)
    let newCells = JSON.parse(text)
    cells.set(newCells.cells)
    id.set(0)
}

export async function saveDocument() {
    const doc = { cells: get(cells) }
    const path = await save({
        filters: [
            {
                name: '.wander',
                extensions: ['wander']
            }
        ]
    })
    console.log(path)
    if (path != null | path != undefined) {
        await writeTextFile(path, JSON.stringify(doc))
    }
}

export function updateType(id: number, type: 'markdown' | 'wander') {
    cells.update((cells) => {
        let res = cells.find((cell) => cell.id == id)
        if (res != undefined) {
            res.type = type
        }
        return cells
    })
}

export function updateSource(id: number, source: string) {
    cells.update((cells) => {
        let res = cells.find((cell) => cell.id == id)
        if (res != undefined) {
            res.source = source
        }
        return cells
    })
}

export function moveUp(id: number) {
    cells.update((cells) => {
        let res = cells.find((cell) => cell.id == id)
        if (res != undefined) {
            const index = cells.indexOf(res)
            if (index > 0) {
                [cells[index-1], cells[index]] = [cells[index], cells[index-1]]
            }
        }
        return cells
    })
}

export function moveDown(id: number) {
    cells.update((cells) => {
        let res = cells.find((cell) => cell.id == id)
        if (res != undefined) {
            const index = cells.indexOf(res)
            if (index+1 < cells.length) {
                [cells[index+1], cells[index]] = [cells[index], cells[index+1]]
            }
        }
        return cells
    })
}

export function appendAfter(id: number) {
    cells.update((cells) => {
        let res = cells.find((cell) => cell.id == id)
        if (res != undefined) {
            const index = cells.indexOf(res)

            const newCell = {
                    id: nextId(),
                    type: 'markdown',
                    output: 'text',
                    source: '# New Cell'
                }
            cells.splice(index+1, 0, newCell)
            return cells
        }
        return cells
    })
}

export function removeCell(id: number) {
    cells.update((cells) => {
        let res = cells.find((cell) => cell.id == id)
        if (res != undefined) {
            const index = cells.indexOf(res)
            cells.splice(index, 1)
            return cells
        } else {
            return cells
        }
    })
}

export function getCells() {
    throw 'TODO'
}
