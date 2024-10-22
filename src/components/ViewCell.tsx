import { marked } from "marked";
import { run } from "@ligature/ligature";
import { Match, Switch } from "solid-js";
import { printNetwork } from "@ligature/ligature-components/src/text/text"
import { ssr } from "solid-js/web";

// export let source: string;
// export let output: string;
// export let type: "markdown" | "wander";

export function ViewCell(props: any) {
    return <div class="cell">
        <Switch>
            <Match when={props.source == "" || props.source == undefined || props.source == null}>
                <div><em>Empty Cell</em></div>
            </Match>
            <Match when={props.source != ""}>
                <Switch>
                    <Match when={props.type == "wander"}>
                        <div>{ssr(marked.parse(props.source))}</div>
                    </Match>
                    <Match when={props.type == "markdown"}>
                        <div><pre><code>{printNetwork(run(props.source))}</code></pre></div>                    
                    </Match>
                </Switch>
            </Match>
        </Switch>
    </div>
}
