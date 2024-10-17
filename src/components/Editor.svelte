<script lang="ts">
    import "@shoelace-style/shoelace/dist/themes/light.css"
    import '@shoelace-style/shoelace/dist/components/button/button'
    import '@shoelace-style/shoelace/dist/components/button-group/button-group'
    import { get, writable } from 'svelte/store';
    import Cell from './Cell.svelte'
    import { addCell, cells, newDocument, openDocument, saveDocument } from "./Store";
    import ViewCell from "./ViewCell.svelte";

    let inEditMode = true
    $: viewEditLabel = inEditMode ? "View" : "Edit"
</script>

<div style="height:100%; width: 100%">
    <div style="height:100%; width: 100%">
        <sl-button-group>
            <sl-button size="small" onclick={addCell}><img src="/icons/plus-lg.svg" alt="Add" /></sl-button>
            <sl-button size="small" onclick={() => {inEditMode = !inEditMode}}>{viewEditLabel}</sl-button>
            <sl-button size="small" onclick={newDocument}>New</sl-button>
            <sl-button size="small" onclick={saveDocument}>Save</sl-button>
            <sl-button size="small" onclick={openDocument}>Open</sl-button>
        </sl-button-group>
        <div>
            {#if inEditMode}
                {#each $cells as cell}
                    <Cell id={cell.id} output={cell.output} source={cell.source} type={cell.type}></Cell>
                {/each}
            {:else}
                {#each $cells as cell}
                    <ViewCell output={cell.output} source={cell.source} type={cell.type}></ViewCell>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>

</style>
