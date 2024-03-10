import { marked } from "marked";
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
import { runBend } from "../lib/ligature-client";

export function Body() {
    const store = useContext(StoreContext);
    createEffect(() => {
        const el = document.querySelector("#body");
        el.hidden = store.state.editMode;
    })
    createEffect(async () => {
        const location = store.state.location
        if (location.match(/^[a-zA-Z-_0-9]+$/)) {
            const res = await runBend('Ligature.query "pages" `' + location + '` `md-content` ? | Array.first | Statement.value');
            const value = JSON.parse(res) //TODO eval this using Bend's interpreter
            store.setBodyContent(value)    
        } else {
            store.setBodyContent("Invalid request.")
        }
    })
    return <>
        <div id="body" innerHTML={marked.parse(store.state.bodyContent)}></div>
    </>;
}
