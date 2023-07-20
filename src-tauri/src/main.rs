// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{RwLock, Arc};

use ligature_client::LigatureZeroMQClient;
use ligature_in_memory::LigatureInMemory;
use ligature_redb::LigatureRedb;
use ligature_sqlite::LigatureSQLite;
use tauri::{State, AppHandle};
use wander::{run, preludes::common, bindings::{BindingsProvider, Bindings}};

struct ApplicationState {
    instance: LigatureSQLite,
}

fn create_ligature_bindings(instance: &LigatureSQLite) -> Bindings {
    let mut bindings = common();
    //let instance = LigatureRedb::default();
    //let instance = LigatureInMemory::new();
    //let instance = ligature_sqlite::LigatureSQLite::default();
    instance.add_bindings(&mut bindings);
    bindings
}

#[tauri::command]
fn run_wander(state: State<ApplicationState>, input: &str) -> String {
    let mut bindings = create_ligature_bindings(&state.instance);
    match run(input, &mut bindings) {
        Err(err) => format!("Error: {}", err.0),
        Ok(value) => format!("{value}")
    }
}

#[tauri::command]
fn run_wander_remote(input: &str) -> String {
    let client = LigatureZeroMQClient::create(4200).unwrap();
    match client.run_wander(input) {
        Err(err) => format!("Error: {}", err.0),
        Ok(value) => format!("Result: {value}")
    }
}

fn main() {
    tauri::Builder::default()
        .manage(ApplicationState { instance: ligature_sqlite::LigatureSQLite::default() })
        .invoke_handler(tauri::generate_handler![run_wander, run_wander_remote])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
