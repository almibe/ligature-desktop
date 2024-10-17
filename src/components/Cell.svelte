<script lang="ts">
    import { get, writable } from "svelte/store";
    import { marked } from "marked";
    import { run, type Entry } from "@ligature/ligature";
    import { updateSource, updateType } from "./Store";

    const editMode = writable(false)
    export let source: string;
    export let id: number;
    export let output: string;
    export let type: "markdown" | "wander";

    const editIcon = "/icons/pencil.svg"
    const editText = "Edit"

    const saveIcon = "/icons/save.svg"
    const saveText = "Save"

    let editSaveIcon = editIcon
    let editSaveAlt = editText
    let markdownButton

    function selectionChange() {
        if (markdownButton.checked) {
            type = "markdown"
        } else {
            type = "wander"
        }
    }

    function callEdit() {
        editMode.update((mode) => !mode)
        if (get(editMode)) {
            editSaveIcon = saveIcon
            editSaveAlt = saveText
        } else {
            editSaveIcon = editIcon
            editSaveAlt = editText
            updateSource(id, source)
            updateType(id, type)
        }
    }

    function printResult(result: Entry[]): string {
        let res = "{\n"
        for (let entry of result) {
            if (entry.type == "extension") {
                res += "  " + entry.element.symbol + " : " + entry.concept.symbol + ",\n"
            } else if (entry.type == "nonextension") {
                res += "  " + entry.element.symbol + " :¬ " + entry.element.symbol + ",\n"
            } else {
                res += "  " + entry.first.symbol + " " + entry.role.symbol + " " + entry.second.symbol + ",\n"
            }
        }
        return res + "}"
    }
</script>

<div class="cell">
    <sl-button variant="text" size="small" onclick={callEdit}><img src={editSaveIcon} alt={editSaveAlt} /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/arrow-up.svg" alt="Move Cell Up" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/arrow-down.svg" alt="Move Cell Down" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/journal-plus.svg" alt="Append New Cell" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/journal-minus.svg" alt="Remove Cell" /></sl-button>
    {#if $editMode}
        <div>
            <div>
                <input on:change={selectionChange} bind:this={markdownButton} type="radio" name={"cellType" + id} value="markdown" checked />
                <label for={"cellType" + id}>MarkDown</label>
                <input on:change={selectionChange} type="radio" name={"cellType" + id} value="wander" />
                <label for={"cellType" + id}>Wander</label>
            </div>
            <textarea bind:value={source}></textarea>
        </div>
    {:else}
        {#if source == ""}
            <div><em>Empty Cell</em></div>
        {:else}
            {#if type == "markdown"}
                <div>{@html marked.parse(source)}</div>
            {:else}
                <div><pre><code>{printResult(run(source))}</code></pre></div>
            {/if}
        {/if}
    {/if}
</div>

<style>

</style>
