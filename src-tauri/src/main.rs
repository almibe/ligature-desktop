// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn run(script: &str) -> String {
    let ctx = zmq::Context::new();

    let socket = ctx.socket(zmq::REQ).unwrap();
    socket.connect("tcp://127.0.0.1:4200").unwrap();
    socket.send(script, 0).unwrap();
    let res =  socket.recv_string(0).unwrap().unwrap();
    format!("Result: {}", res)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, run])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
