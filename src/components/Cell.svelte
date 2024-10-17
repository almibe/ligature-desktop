<script lang="ts">
import { writable } from "svelte/store";

const editMode = writable(false)
export let source;
export let id;
export let type;

function callEdit() {
    editMode.update((mode) => !mode)
}
</script>

<div class="cell">
    <sl-button variant="text" size="small" onclick={callEdit}><img src="/icons/pencil.svg" alt="Edit" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/arrow-up.svg" alt="Move Cell Up" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/arrow-down.svg" alt="Move Cell Down" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/journal-plus.svg" alt="Append New Cell" /></sl-button>
    <sl-button variant="text" size="small"><img src="/icons/journal-minus.svg" alt="Remove Cell" /></sl-button>
    {#if $editMode}
        <div>
            <textarea>{source}</textarea>
        </div>
    {:else}
        <div><em>Empty Cell</em></div>
    {/if}
</div>
