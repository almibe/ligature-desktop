import { invoke } from '@tauri-apps/api/core';

export async function runWander(script: string): Promise<string> {
    return await invoke("run_wander", {script} )
}
