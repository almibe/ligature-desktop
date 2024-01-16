import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { bus } from './bus.ts';
import { For, createSignal } from 'solid-js';
import { ModuleValue, WanderError, WanderResult, WanderValue } from '@wander-lang/wander/src/values.ts';
import { Either } from 'purify-ts'
import { printResult, printValue } from '@wander-lang/wander/src/interpreter.ts';

const [results, setResults] = createSignal([]);

let id = 0n;

bus.on("AddResult", (result: Either<WanderError, WanderValue>) => {
  id++;
  result.id = id;
  setResults([result, ...results()])
})

bus.on("RemoveResult", (result) => {
    const newResult = results().filter(r => r.id != result.id);
    setResults(newResult);
  })

export function Results() {
    return <>
        <For each={results()}>
            {(result) =>
                <Result result={result} />
            }
        </For>
    </>;
}

function Result(props: { result: WanderResult}) {
    return <div class="result">
        {props.result.isLeft() && <ResultError error={props.result.leftOrDefault("")}></ResultError>}
        {props.result.isRight() && <ResultSuccess result={props.result}></ResultSuccess> }
    </div>
}

function ResultSuccess(props) {
    if (props.result.isLeft()) {
        renderResult("danger", printResult(props.result))
    } else {
        const result: WanderValue = props.result.unsafeCoerce()[0];
        if (result.type == "Module") {
            if (result.value.has("error")) {
                return renderResult("danger", result.value.get("error").value)
            } else {
                return renderResult("success", printValue(result))
            }
        } else {
            return renderResult("success", printValue(result))
        }
    }
}

function renderResult(variant: string, message: string) {
    return <sl-alert variant={variant} class="result" open>
        <strong>{message}</strong>
        <span onClick={e => bus.emit("RemoveResult", {id: props.result.id})} style="float:right">
            <sl-icon name="x-lg" library="system"></sl-icon>
        </span>
    </sl-alert>
}

function ResultError(props) {
    return <h1>Error</h1>;
}