import { invoke } from '@tauri-apps/api/tauri'

export async function runWander(script: string): Promise<string> {
    return await invoke("run_bend", {script} )
}
