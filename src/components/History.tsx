import { For, createEffect, createSignal, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
import { runBend } from "../lib/ligature-client";

export function History() {
  const store = useContext(StoreContext);
  const [versions, setVersions] = createSignal([]);

  createEffect(async () => {
    const results = await runBend('Ligature.match "pages" @location `entry` ?' + 
      '| Array.map Statement.value | Array.map Identifier.value',
      new Map([["location", "`" + store.state.location + "`"]]));
    console.log("History:",results)  
    //setVersions(JSON.parse(results));
  });

  return <>
      <div class="content" id="history">
        <h1>History for `{store.state.location}`</h1>
        <ul>
        <For each={versions()}>{(version) =>
          <li>
            <code><a href="#" onclick={() => store.setLocation(version)}>{version}</a></code>
          </li>
        }</For>
        </ul>
      </div>
  </>;
}
