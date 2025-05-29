use std::sync::Mutex;
use tauri::Manager;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Default)]
struct AppData {
    message: &'static str,
}

#[tauri::command]
fn change_message(app: tauri::AppHandle, new_message: String) {
    let data = app.state::<Mutex<AppData>>();
    let mut state = data.lock().unwrap();
    state.message = Box::leak(new_message.into_boxed_str());
    println!("Message changed to: {}", state.message);
}

#[tauri::command]
fn get_message(app: tauri::AppHandle) -> String {
    let data = app.state::<Mutex<AppData>>();
    let state = data.lock().unwrap();
    state.message.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            app.manage(Mutex::new(AppData::default()));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, change_message, get_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
