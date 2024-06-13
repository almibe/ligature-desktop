import { runWander } from "../lib/ligature-client";

export type State = {
    editorContent: string,
    resultContent: string
}

export function createStore(): State {
    return {
        editorContent: "",
        resultContent: "",
    }
}

export async function run(state: State): Promise<State> {
    console.log("in run", state.editorContent)
    let resultContent = await runWander(state.editorContent)
    console.log("result", resultContent)
    return {
        editorContent: state.editorContent,
        resultContent
    }
}
