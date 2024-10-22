import { For } from "solid-js";
import { store } from "./Store";
import { EditCell } from "./EditCell";

export function NotebookEdit() {
    return <>
        <For each={store.cells}>
            {(cell, index) =>
                <EditCell id={cell.id} output={cell.output} source={cell.source} type={cell.type}></EditCell>
        }
        </For></>
}
