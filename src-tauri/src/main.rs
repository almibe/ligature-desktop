// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use ligature_client::LigatureZeroMQClient;
use wander::{run, preludes::common};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(input: &str) -> String {
    let client = LigatureZeroMQClient::create(4200).unwrap();
    match client.run_wander(input) {
        Err(err) => format!("Error: {}", err.0),
        Ok(value) => format!("Result: {value}")
    }
}

#[tauri::command]
fn run_local(input: &str) -> String {
    match run(input, &mut common()) {
        Err(err) => format!("Local Error: {}", err.0),
        Ok(value) => format!("Local Result: {value}")
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, run_local])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
