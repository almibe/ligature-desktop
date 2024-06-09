import { invoke } from '@tauri-apps/api/tauri'

export async function runBend(script: string): Promise<string> {
    return await invoke("run_bend", {script} )
}
