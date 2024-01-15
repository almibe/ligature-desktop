// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command(async)]
fn run(script: String) -> String {
    let ctx = zmq::Context::new();
    let socket = ctx.socket(zmq::REQ).unwrap();
    socket.connect("tcp://127.0.0.1:4200").unwrap();
    socket.send(&script, 0).unwrap();
    socket.recv_string(0).unwrap().unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
