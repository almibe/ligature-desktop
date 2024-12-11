#[tauri::command(async)]
fn run_wander(script: String) -> String {
    let ctx = zmq::Context::new();
    let socket = ctx.socket(zmq::REQ).unwrap();
    socket.connect("tcp://127.0.0.1:4200").unwrap();
    socket.send(&script, 0).unwrap();
    socket.recv_string(0).unwrap().unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![run_wander])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
