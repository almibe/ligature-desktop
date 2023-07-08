<script lang="ts">
  import Editor from "./Editor.svelte";
  import Results from "./Results.svelte";

  export let results = "";

  function handleResults(event) {
    results = event.detail.results;
  }

</script>

<div>
  <Editor on:results={handleResults}/>
  <Results {results} />
</div>
