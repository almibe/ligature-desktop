import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import { bus } from './bus.ts';
import { For, createSignal } from 'solid-js';

const [results, setResults] = createSignal([]);

let id = 0n;

bus.on("AddResult", (result) => {
  id++;
  result.id = id;
  setResults([result, ...results()])
})

bus.on("RemoveResult", (result) => {
    console.log("In remove result ", result);
    const newResult = results().filter(r => r.id != result.id);
    console.log(newResult);
    setResults(newResult);
  })

export function Results() {
    return <>
        <For each={results()}>
            {(result) =>
                <Result text={result.text} id={result.id} />
            }
        </For>
    </>;
}

function Result(props) {
    console.log("in result", props.text);
    return <div class="result">
        <sl-alert variant="success" class="result" open>
            <strong>{props.text}</strong>
            <span onClick={e => bus.emit("RemoveResult", {id: props.id})} style="float:right">
                <sl-icon name="x-lg" library="system"></sl-icon>
            </span>
        </sl-alert>
    </div>
}
