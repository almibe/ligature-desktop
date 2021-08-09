<script lang="typescript">
    import { onMount } from "svelte";
    import type { Value, LiteralRange, Dataset } from "@ligature/ligature";
    import { ligature } from '../../store/store';
    import { checkValue } from "./dataset";
    import {defaultKeymap} from "@codemirror/commands"
    import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"

    export let dataset: Dataset

    let errors: string[] = [];
    let messages: string[] = [];

    function addError(error: string) {
        errors = [...errors, error];
    }

    function addMessage(message: string) {
        messages = [...messages, message];
    }

    onMount(() => {
        let view = new EditorView({
            state: EditorState.create({extensions: [basicSetup]}),
            parent: document.getElementById("editor")
        })
    });
</script>

<div class="row align-items-center">
    <div class="col">
        <div id="editor" />
    </div>
</div>
<div class="row">
    {#each errors as error}
        <p>Error: {error}</p>
    {/each}
    {#each messages as message}
        <p>{message}</p>
    {/each}
</div>
