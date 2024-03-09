import { marked } from "marked";
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";

export function Body() {
    const store = useContext(StoreContext);
    createEffect(() => {
        const el = document.querySelector("#body");
        el.hidden = store.state.editMode;
    })
    return <>
        <div id="body" innerHTML={marked.parse(store.state.bodyContent)}></div>
    </>;
}
