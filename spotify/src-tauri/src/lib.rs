use std::{fs::{self, File}, io::Read, time::{SystemTime, UNIX_EPOCH}};
use tauri::{Manager, async_runtime::spawn_blocking};
use tauri_plugin_store::StoreExt;
use zip::{ZipArchive, result::ZipError};
mod models;

#[derive(Debug, thiserror::Error)]
enum AppError {
  #[error("Tauri error: {0}")]
  Tauri(#[from] tauri::Error),
  #[error("IO error: {0}")]
  Io(#[from] std::io::Error),
  #[error("ZIP error: {0}")]
  Zip(#[from] ZipError),
  #[error("JSON error: {0}")]
  Json(#[from] serde_json::Error),
  #[error("Task join error: {0}")]
  Join(String),
  #[error("Tauri Store error: {0}")]
  Store(#[from] tauri_plugin_store::Error)
}

impl serde::Serialize for AppError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn save_raw_track_data(app: &tauri::AppHandle, file_name: &str, data: &Vec<models::RawTrackData>) -> Result<(), AppError> {
    let dir = app.path().app_data_dir()?.join("raw_history/");
    fs::create_dir_all(&dir)?;
    let json = serde_json::to_string_pretty(&data)?;
    let file_path = dir.join(&file_name);
    fs::write(file_path, json)?;

    Ok(())
}

#[tauri::command]
async fn process_zip_file(app: tauri::AppHandle, file_path: String) -> Result<String, AppError> {
    println!("Received file path: {}", file_path);
    let store = app.store("store.json")?;
    store.set("full-history-processed", false);
    store.set("last-upload-history", SystemTime::now().duration_since(UNIX_EPOCH).expect("bad").as_millis() as u64);
    store.save()?;

    let result = spawn_blocking(move || -> Result<String, AppError> {
        let file = File::open(&file_path)?;
        
        let mut archive = ZipArchive::new(file)?;

        for i in 0..archive.len() {
            let mut file = archive.by_index(i)?;
            if file.is_file() {
                let file_name = file.name().to_string().rsplit('/').next().unwrap().to_string();

                if file_name.ends_with(".json") {
                    println!("Parsing {}", file_name);
                    let mut buf = Vec::new();
                    file.read_to_end(&mut buf)?;
                    let data: Vec<models::RawTrackData> = serde_json::from_slice(&buf)?;
                    
                    store.set(file_name.to_owned() + "-processed", false);
                    save_raw_track_data(&app, &file_name, &data)?;
                }
            }
        }
        store.save()?;

        Ok::<_, AppError>(format!("Successfully read {} files from archive", archive.len()))
    }).await.map_err(|e| AppError::Join(e.to_string()))??;

    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, process_zip_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
