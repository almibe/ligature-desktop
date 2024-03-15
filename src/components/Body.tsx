import { marked } from "marked";
import { createEffect, createSignal, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
import { runBend } from "../lib/ligature-client";

const walkTokens = async (token) => {
    if (token.type === 'code' && token.lang === 'bend-run') {
        let result = await runBend(token.text)
        if (result.startsWith("\"")) {
            result = JSON.parse(result)
            marked.use({ renderer, walkTokens });
            let res = await marked.parse(result)
            token.escaped = true
            token.text = await marked.parse(res)
            token.type = "html"        
        } else {
            token.text = result
        }
    }
}

const renderer = {
    codespan(text) {
      if (text.match(/^[a-zA-Z-_0-9]+$/)) {
        return `<code><a href="#" class="internalLink" data-location="${text}">${text}</a></code>`
      } else {
        return `<code>${text}</code>`
      }
    },
}

export function Body() {
    marked.use({ renderer, walkTokens, async: true });
    const [res, setRes] = createSignal("")
    const store = useContext(StoreContext);
    createEffect(async () => {
        setRes(await marked.parse(store.state.bodyContent))
    })
    createEffect(() => {
        if (store.state.mode == "Preview") {
            store.setBodyContent(store.state.editorContent)
        }
    })
    createEffect(() => {
        setTimeout(() => {
            const el = document.querySelector("#body");
            el.hidden = store.state.mode == "Edit";                
        });
    })
    return <>
        <div onclick={checkLink} id="body" innerHTML={res()}></div>
    </>;

    function checkLink(e) {
        const location = e.target.getAttribute("data-location") ;
        if (location) {        
            const store = useContext(StoreContext);
            store.setLocation(location);
        }
    }
}
