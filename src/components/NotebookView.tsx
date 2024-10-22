import { For } from "solid-js";
import { store } from "./Store";
import { ViewCell } from "./ViewCell";

export function NotebookView() {
    return <><div>view</div>
        <For each={store.cells}>
            {(cell, index) =>
                <ViewCell output={cell.output} source={cell.source} type={cell.type}></ViewCell>
            }
        </For></>
}
