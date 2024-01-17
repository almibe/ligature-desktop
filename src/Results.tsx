import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { bus } from './bus.ts';
import { For, createSignal } from 'solid-js';
import { ModuleValue, WanderError, WanderResult, WanderValue } from '@wander-lang/wander/src/values.ts';
import { Either } from 'purify-ts'
import { printResult, printValue } from '@wander-lang/wander/src/interpreter.ts';

export interface Applet {
    readonly name: string
    readonly predicate: (value: WanderResult) => boolean
    readonly render: (value: WanderResult) => Element
}

interface Result {
    readonly id: number
    readonly script: string
    readonly wanderResult: WanderResult
    readonly applet: Applet
}

const [results, setResults] = createSignal<Result[]>([]);
const [applets, setApplets] = createSignal<Applet[]>([]);

let id = 0n;

const textApplet: Applet = {
    name: "Text",
    predicate: (value) => true,
    render: (value: WanderResult) => {
        return <span class="result">{printResult(value)}</span>
    }
}

bus.on("AddResult", (wanderResult: WanderResult) => {
    id++;
    let result = {
        id,
        script: "?",
        wanderResult: wanderResult,
        applet: textApplet
    }
    setResults([result, ...results()])
})

bus.on("RemoveResult", (result) => {
    console.log(result)
    const newResult = results().filter(r => r.id != result.id);
    setResults(newResult);
})

bus.on("AddApplet", (applet: Applet) => {
    setApplets([applet, ...applets()])
})

bus.on("RemoveApplet", (applet: Applet) => {
      const newResult = applets().filter(r => r == applet);
      setApplets(newResult);
})

bus.emit("AddApplet", textApplet)

export function Results() {
    return <>
        <For each={results()}>
            {(result) =>
                <Result result={result} />
            }
        </For>
    </>;
}

function Result(props: { result: Result}) {
    return <div class="result">
        {props.result.wanderResult.isLeft() && <ResultError error={props.result.wanderResult.leftOrDefault("")}></ResultError>}
        {props.result.wanderResult.isRight() && <ResultSuccess result={props.result}></ResultSuccess> }
    </div>
}

function ResultSuccess(props: { result: Result}) {
    if (props.result.wanderResult.isLeft()) {
        renderResult("danger", printResult(props.result.wanderResult), props.result.id, props.result)
    } else {
        const result: WanderValue = props.result.wanderResult.unsafeCoerce()[0];
        if (result.type == "Module") {
            if (result.value.has("error")) {
                return renderResult("danger", result.value.get("error").value, props.result.id, props.result)
            } else {
                return renderResult("success", printValue(result.value.get("result")), props.result.id, props.result)
            }
        } else {
            return renderResult("success", printValue(result), props.result.id, props.result)
        }
    }
}

function renderResult(variant: string, message: string, id: number, result: Result) {
    return <sl-alert variant={variant} open>
        {result.applet.render(result.wanderResult)}
        <sl-dropdown style="float:right">
            <sl-icon slot="trigger"  name="caret" library="system"></sl-icon>
            <sl-menu>
                <For each={applets()}>
                    {(applet) =>
                        <sl-menu-item >{applet.name}</sl-menu-item>
                    }
                </For>
                <sl-divider></sl-divider>
                <sl-menu-item >
                    <span onClick={e => bus.emit("RemoveResult", {id})} style="float:right">
                        Remove <sl-icon name="x-lg" library="system"></sl-icon>
                    </span>
                </sl-menu-item>
            </sl-menu>
        </sl-dropdown>
    </sl-alert>
}

function ResultError(props) {
    return <h1>Error</h1>;
}
