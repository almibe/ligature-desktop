import { marked } from "marked";
import { createEffect, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
import { runBend } from "../lib/ligature-client";

const renderer = {
    codespan(text) {
      if (text.match(/[a-zA-Z-_0-9]+/)) {
        return `<code><a href="#" class="internalLink" data-location="${text}">${text}</a></code>`
      } else {
        return `<code>${text}</code>`
      }
    }
};

export function Body() {
    marked.use({ renderer });

    const store = useContext(StoreContext);
    createEffect(() => {
        const el = document.querySelector("#body");
        el.hidden = store.state.mode == "Edit";
    })
    createEffect(async () => {
        const location = store.state.location
        if (location.match(/^[a-zA-Z-_0-9]+$/)) {
            const res = await runBend('Ligature.query "pages" `' + location + '` `md-content` ? | Array.map Statement.value');
            if (res.startsWith('[')) {
                const value = JSON.parse(res) //TODO eval this using Bend's interpreter
                if (value.length == 1) {
                    store.setBodyContent(value[0])
                } else {
                    store.setBodyContent("New page.")
                    store.setEdit(true)
                }
            } else {
                store.setBodyContent(res)
            }
        } else {
            store.setBodyContent("Invalid request.")
        }
    })
    return <>
        <div onclick={checkLink} id="body" innerHTML={marked.parse(store.state.bodyContent)}></div>
    </>;

    function checkLink(e) {
        const location = e.target.getAttribute("data-location") ;
        if (location) {        
            const store = useContext(StoreContext);
            store.setLocation(location);
        }
    }
}
