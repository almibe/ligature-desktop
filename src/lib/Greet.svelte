<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri"

  let input = "";
  let greetMsg = ""

  async function greet(){
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsg = await invoke("greet", { input })
  }
</script>

<div>
  <form class="row" on:submit|preventDefault={greet}>
    <input id="greet-input" placeholder="Enter a name..." bind:value={input} />
    <button type="submit">Greet</button>
  </form>
  <p>{greetMsg}</p>
</div>