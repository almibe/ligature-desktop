<script lang="typescript">
    import AddStatementsPanel from "./AddStatementsPanel.svelte";
    import QueryStatementsPanel from "./QueryStatementsPanel.svelte";
    import WanderPanel from "./WanderPanel.svelte";
    import { onMount } from "svelte";
    import type { Dataset } from "@ligature/ligature";

    export let dataset: Dataset

    onMount(async () => {
        await import("../../../node_modules/bootstrap/dist/js/bootstrap.esm");
    });
</script>

<ul class="nav nav-tabs" id="datasetTab" role="tablist">
    <li class="nav-item" role="presentation">
        <button class="nav-link active" id="add-statements-tab" data-bs-toggle="tab" data-bs-target="#addStatements" type="button" role="tab" aria-controls="addStatements" aria-selected="true">Add</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="query-statements-tab" data-bs-toggle="tab" data-bs-target="#queryStatements" type="button" role="tab" aria-controls="queryStatements" aria-selected="false">Query</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#wander" type="button" role="tab" aria-controls="wander" aria-selected="false">Wander</button>
    </li>
</ul>
<div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="addStatements" role="tabpanel" aria-labelledby="add-statements-tab"><AddStatementsPanel /></div>
    <div class="tab-pane fade" id="queryStatements" role="tabpanel" aria-labelledby="query-statements-tab"><QueryStatementsPanel /></div>
    <div class="tab-pane fade" id="wander" role="tabpanel" aria-labelledby="wander-tab"><WanderPanel /></div>
</div>
