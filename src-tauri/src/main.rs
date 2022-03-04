// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{command};

#[command]
fn add_dataset(name: String) {
  println!("Adding Dataset: {}", name);
}

#[command]
fn remove_dataset(name: String) {
  println!("Removing Dataset: {}", name);
}

#[command]
fn all_datasets() {
  println!("Returning Datasets: {}", "");
}

#[command]
fn run_write(dataset: String, input: String) {
  println!("Running Write on {}:\n{}", dataset, input);
}

#[command]
fn run_query(dataset: String, input: String) {
  println!("Running Query on {}:\n{}", dataset, input);
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      add_dataset,
      remove_dataset,
      all_datasets,
      run_write,
      run_query,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
