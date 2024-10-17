<script lang="ts">
    import { marked } from "marked";
    import { run, type Entry } from "@ligature/ligature";

    export let source: string;
    export let output: string;
    export let type: "markdown" | "wander";

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
    {#if source == ""}
        <div><em>Empty Cell</em></div>
    {:else}
        {#if type == "markdown"}
            <div>{@html marked.parse(source)}</div>
        {:else}
            <div><pre><code>{printResult(run(source))}</code></pre></div>
        {/if}
    {/if}
</div>

<style>

</style>
