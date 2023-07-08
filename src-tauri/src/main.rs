// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use wander::{run, preludes::common};

#[tauri::command]
fn run_wander(input: &str) -> String {
    match run(input, &mut common()) {
        Err(err) => format!("Error: {}", err.0),
        Ok(value) => format!("{value}")
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_wander])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
