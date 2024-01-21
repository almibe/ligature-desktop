import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import { bus } from './bus.ts';
import { For } from 'solid-js';
import { WanderResult } from '@wander-lang/wander/src/values.ts';
import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
import { Applet, applets, rawTextApplet } from './applets.ts';
const [store, setStore] = createStore({results: []});

interface Result {
    readonly id: number
    readonly script: string
    readonly wanderResult: WanderResult
    readonly applet: Applet
    readonly content: string
}

let id = 0n;

bus.on("AddResult", ({ result, script} ) => {
    id++;
    let finalResult = {
        id,
        script: script,
        wanderResult: result,
        applet: rawTextApplet,
        content: rawTextApplet.render(result)
    };
    setStore(produce((store) => {
        store.results = [finalResult, ...store.results];
    }))
})

bus.on("RemoveResult", (result) => {
    setStore(produce((store) => {
        store.results = store.results.filter(r => r.id != result.id);
    }))
})

export function Results() {
    return <>
        <For each={store.results}>
            {(result) =>
                <Result result={result} />
            }
        </For>
    </>;
}

function Result(props: { result: Result}) {
    return <div class="result">
        {renderResult(props.result)}
    </div>
}

function changeApplet(result: Result, applet: Applet) {
    setStore(produce((store) => {
        let prevResult = store.results.find(r => r.id == result.id)
        prevResult.applet = applet
        prevResult.content = applet.render(result.wanderResult)
    }))
}

function renderResult(result: Result) {
    const filteredApplets = () => applets().filter(applet =>
        applet.predicate(result.wanderResult) 
    )

    return <sl-card style="width:100%">
        <span innerHTML={result.content}></span>
        <sl-dropdown style="float:right">
            <sl-button slot="trigger">
               {result.applet.name}<sl-icon name="caret" library="system"></sl-icon>
            </sl-button>
            <sl-menu id={"menu" + result.id}>
                <For each={filteredApplets()}>
                    {(applet) =>
                        <sl-menu-item onClick={() => changeApplet(result, applet)} >{applet.name}</sl-menu-item>
                    }
                </For>
                <sl-divider></sl-divider>
                <sl-menu-item>
                    <span onClick={e => bus.emit("SetEditor", {script: result.script})}>
                        Edit
                    </span>
                </sl-menu-item>
                <sl-menu-item>
                    <span onClick={e => bus.emit("RemoveResult", {id: result.id})} style="float:right">
                        Remove <sl-icon name="x-lg" library="system"></sl-icon>
                    </span>
                </sl-menu-item>
            </sl-menu>
        </sl-dropdown>
    </sl-card>
}
