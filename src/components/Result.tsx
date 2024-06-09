import { marked } from "marked";
import { createEffect, createSignal, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
import { runBend } from "../lib/ligature-client";

const walkTokens = async (token: any) => {
    if (token.type === 'code' && token.lang === 'bend-run') {
        let result = await runBend(token.text, new Map([]))
        if (result.startsWith("\"")) {
            result = JSON.parse(result)
            marked.use({ renderer, walkTokens });
            let res = await marked.parse(result)
            token.escaped = true
            token.text = res //await marked.parse(res)
            token.type = "html"        
        } else {
            token.text = result
        }
    }
}

const renderer = {
    codespan(text: string) {
      if (text.match(/^[a-zA-Z-_0-9]+$/)) {
        return `<code><a href="#" class="internalLink" data-location="${text}">${text}</a></code>`
      } else {
        return `<code>${text}</code>`
      }
    },
    code(code: string, infostring: string | undefined, escaped: boolean): string {
        const lang = (infostring || '').match(/^\S*/)?.[0];
    
        code = code.replace(/\n$/, '') + '\n';
    
        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        if (lang == "bend-run") {
            return '<div>'
            + (escaped ? code : escape(code, true))
            + '</div>\n';
        }
    
        return '<pre><code class="language-'
          + escape(lang)
          + '">'
          + (escaped ? code : escape(code, true))
          + '</code></pre>\n';
    }
}

const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
const escapeReplacements: {[index: string]: string} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];

export function escape(html: string, encode?: boolean) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

export function Result() {
    marked.use({ renderer, walkTokens, async: true });
    const [res, setRes] = createSignal("")
    const store = useContext(StoreContext);
    createEffect(async () => {
        setRes(await marked.parse(store.state.bodyContent))
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
