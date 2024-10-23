import { For } from "solid-js";
import { store } from "./Store";
import { ViewCell } from "./ViewCell";

export function NotebookView() {
        return <For each={store.cells}>
            {(cell, index) => {
                return <ViewCell id={index()}></ViewCell>
            }}
        </For>
}
