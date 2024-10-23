import { marked } from "marked";
import { Match, Switch } from "solid-js";
import { lookupCell } from "./Store";
import { run } from "@ligature/ligature";
import { printNetwork } from "@ligature/ligature-components/src/text/text"

export function ViewCell(props: {id: number}) {
    const id = props.id
    const cell = lookupCell(id)
    return <div class="cell">
        <Switch>
            <Match when={cell.source == "" || cell.source == undefined || cell.source == null}>
                <div><em>Empty Cell</em></div>
            </Match>
            <Match when={cell.source != ""}>
                <Switch>
                    <Match when={cell.type == "markdown"}>
                        <div innerHTML={marked.parse(cell.source)} />
                    </Match>
                    <Match when={cell.type == "wander"}>
                        <div><pre><code>{printNetwork(run(cell.source))}</code></pre></div>                    
                    </Match>
                </Switch>
            </Match>
        </Switch>
    </div>
}
