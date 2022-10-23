#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn add_dataset(name: String) -> String {
//  reqwest
  format!("Adding Dataset: {}", name)
}

#[tauri::command]
fn remove_dataset(name: String) {
  println!("Removing Dataset: {}", name);
}

#[tauri::command]
fn all_datasets() -> Vec<String> {
  println!("Returning Datasets: {}", "");
  vec![]
}

#[tauri::command]
fn run_write(dataset: String, input: String) {
  println!("Running Write on {}:\n{}", dataset, input);
}

#[tauri::command]
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
