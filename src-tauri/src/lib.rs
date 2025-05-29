use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tokio::{
    self,
    time::{Duration},
};
use std::sync::Arc;
use tokio_util::sync::CancellationToken;

use std::sync::Mutex;
use tauri::Manager;

struct AppState {
    countdown_token: Option<CancellationToken>,
    remaining_seconds: u64,
    is_paused: bool,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            countdown_token: None,
            remaining_seconds: 0,
            is_paused: false,
        }
    }
}

#[derive(Clone, Serialize)]
#[serde()]
struct CountdownEvent {
    time_remaining: u64,
}

#[tauri::command]
async fn set_countdown(
    app: AppHandle,
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
    seconds: u64,
) -> Result<(), String> {
    // 先停止之前的倒计时
    stop_countdown(state.clone()).await?;
    
    let token = CancellationToken::new();
    
    // 保存 token 到状态中
    {
        let mut app_state = state.lock().unwrap();
        app_state.countdown_token = Some(token.clone());
        app_state.remaining_seconds = seconds;
        app_state.is_paused = false;
    }
    
    let mut time_remaining = seconds;
    let mut interval = tokio::time::interval(Duration::from_secs(1));
    
    // 跳过第一个tick
    interval.tick().await;
    
    while time_remaining > 0 {
        tokio::select! {
            _ = interval.tick() => {
                time_remaining -= 1;
                println!("{}", time_remaining);

                {
                    let mut app_state = state.lock().unwrap();
                    app_state.remaining_seconds = time_remaining;
                }
                
                if let Err(e) = app.emit("countdown_event", CountdownEvent { time_remaining }) {
                    eprintln!("Failed to emit event: {}", e);
                    break;
                }
            }
            _ = token.cancelled() => {
                println!("Countdown cancelled!");
                return Ok(());
            }
        }
    }
    
    // 倒计时完成，清理状态
    {
        let mut app_state = state.lock().unwrap();
        app_state.countdown_token = None;
        app_state.remaining_seconds = 0;
        app_state.is_paused = false;
    }
    
    println!("Countdown finished!");
    Ok(())
}

#[tauri::command]
async fn stop_countdown(
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
) -> Result<(), String> {
    let mut app_state = state.lock().unwrap();
    
    if let Some(token) = app_state.countdown_token.take() {
        token.cancel();
        app_state.is_paused = true;
        println!("Countdown stopped!");
    }
    
    Ok(())
}

#[tauri::command]
async fn continue_countdown(
    app: AppHandle,
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
) -> Result<(), String> {
    let remaining_time = {
        let app_state = state.lock().unwrap();
        if !app_state.is_paused || app_state.remaining_seconds == 0 {
            return Err("No paused countdown to resume".to_string());
        }
        app_state.remaining_seconds
    };
    
    // 使用剩余时间重新开始倒计时
    set_countdown(app, state, remaining_time).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = Arc::new(Mutex::new(AppState::default()));
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            app.manage(app_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![set_countdown, stop_countdown, continue_countdown])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
