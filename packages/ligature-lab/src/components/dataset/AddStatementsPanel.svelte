<script lang="typescript">
    import type { Dataset } from "@ligature/ligature";

    export let dataset: Dataset

    function addStatement() {
        //TODO
    }
</script>
<div class="row align-items-center">
    <div class="col">
        <label for="entityQueryInput" class="form-label">Entity</label>
        <input type="text" class="form-control" id="entityQueryInput" placeholder="Entity">
    </div>
    <div class="col">
        <label for="attributeQueryInput" class="form-label">Attribute</label>
        <input type="text" class="form-control" id="attributeQueryInput" placeholder="Attribute">
    </div>
    <div class="col">
        <label for="valueQueryInput" class="form-label">Value ?</label>
        <input type="text" class="form-control" id="valueQueryInput" placeholder="Value">
    </div>
    <div class="col">
        <label for="contextQueryInput" class="form-label">Context</label>
        <input type="text" class="form-control" id="contextQueryInput" placeholder="Context">
    </div>
    <div class="col">
        <button type="button" class="btn btn-outline-dark" on:click={() => addStatement()}>Add</button>
    </div>
</div>
