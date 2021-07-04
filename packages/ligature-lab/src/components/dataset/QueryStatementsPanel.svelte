<script lang="typescript">
    import type { Dataset } from "@ligature/ligature";

    export let dataset: Dataset

    function queryStatements() {
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
        <input type="text" class="form-control" id="valueStartQueryInput" placeholder="Value Start">
        <input type="text" class="form-control" id="valuleStopQueryInput" placeholder="Value Stop">
    </div>
    <div class="col">
        <label for="contextQueryInput" class="form-label">Context</label>
        <input type="text" class="form-control" id="contextQueryInput" placeholder="Context">
    </div>
    <div class="col">
        <button type="button" class="btn btn-outline-dark" on:click={() => queryStatements()}>Query</button>
    </div>
</div>
