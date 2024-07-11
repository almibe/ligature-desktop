import { Show, createEffect, useContext } from "solid-js";
import { StoreContext } from "../StoreProvider";
import { initializeTable } from "@ligature/ligature-components/src/table/LigatureTable";
import { initializeGraph } from "@ligature/ligature-components/src/graph/LigatureGraph";

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
    const store = useContext(StoreContext);
    createEffect(() => {
      if (store.state.selected == "graph") {
        setTimeout(() => {
          initializeGraph(document.querySelector("#resultGraph"), store.state.resultContent)
        })
      } else if (store.state.selected == "table") {
        initializeTable(document.querySelector("#resultTable"), store.state.resultContent)
      }
    })

    return <div id="resultBody">
      <Show when={store.state.selected == "text"}>
        <div id="resultText">{store.state.resultContent}</div>
      </Show>
      <Show when={store.state.selected == "table"}>
        <div id="resultTable"></div>
      </Show>
      <Show when={store.state.selected == "graph"}>
        <div id="resultGraph" style="height:400px; width: 800px;"></div>
      </Show>
    </div>
}
