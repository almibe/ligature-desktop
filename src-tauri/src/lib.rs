use std::{env, ffi::OsStr, fs::File, io::Read};
use tauri::Emitter;
use walkdir::WalkDir;

#[tauri::command]
fn start_up(webview_window: tauri::WebviewWindow) -> () {
    // let test_suite = env::var("LIGATURE_TEST_SUITE").unwrap() + "/core/";
    // for entry in WalkDir::new(&test_suite) {
    //     let entry = entry.unwrap();
    //     if entry.path().extension() == Some(OsStr::new("wander")) {
    //         webview_window
    //             .emit(
    //                 "add_file",
    //                 entry
    //                     .path()
    //                     .display()
    //                     .to_string()
    //                     .trim_start_matches(&test_suite),
    //             )
    //             .unwrap();
    //     }
    // }
}

#[tauri::command]
fn open_file(name: &str, webview_window: tauri::WebviewWindow) -> () {
    let file_name = env::var("LIGATURE_TEST_SUITE").unwrap() + "/core/" + name;
    let mut file = File::open(file_name).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    webview_window.emit("set_editor", contents).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_up, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
