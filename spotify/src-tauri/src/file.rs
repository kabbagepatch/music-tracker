use std::{fs, path::PathBuf};

use tauri::{Error, Manager};

use crate::models::{RawTrackData, EntryStats};

const RAW_HISTORY: &str = "raw_history/";
const PROCESSED_HISTORY: &str = "processed_history";

pub fn save_raw_track_data(app: &tauri::AppHandle, file_name: &str, data: &Vec<RawTrackData>) -> Result<(), Error> {
    let dir = app.path().app_data_dir()?.join(RAW_HISTORY);
    fs::create_dir_all(&dir)?;
    let json = serde_json::to_string_pretty(&data)?;
    let file_path = dir.join(&file_name);
    fs::write(file_path, json)?;

    Ok(())
}

pub fn get_raw_history(app: &tauri::AppHandle) -> Result<Vec<PathBuf>, Error> {
  let raw_history_dir = app.path().app_data_dir()?.join(RAW_HISTORY);
  let raw_json_files = fs::read_dir(raw_history_dir)?
    .filter_map(|entry| entry.ok())
    .map(|entry| entry.path())
    .filter(|path| {
        path.extension().and_then(|ext| ext.to_str()) == Some("json")
    })
    .collect();

  Ok(raw_json_files)
}

fn get_base_dir(app: &tauri::AppHandle, year: i32, month: Option<u32>) -> PathBuf {
  let base = app.path().app_data_dir().unwrap();
  let dir = match month {
      Some(month) => base.join(format!("{}/yearly/{}/{}", PROCESSED_HISTORY, year, month)),
      None => base.join(format!("{}/yearly/{}", PROCESSED_HISTORY, year)),
  };

  dir
}

pub fn create_stats_dir(app: &tauri::AppHandle, year: i32, month: Option<u32>) -> Result<(), Error> {
  let dir = get_base_dir(&app, year, month);
  fs::create_dir_all(&dir)?;

  Ok(())
}

pub fn save_processed_data(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str, data: &EntryStats) -> Result<(), Error> {
    let dir = get_base_dir(&app, year, month);
    fs::create_dir_all(&dir)?;
    let json = serde_json::to_string_pretty(&data)?;
    let file_path = dir.join(&file_name);
    fs::write(file_path, json)?;

    Ok(())
}

pub fn rename_temp_file(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str) -> Result<(), Error> {
    let dir = get_base_dir(&app, year, month);
    let temp_file_path = dir.join(format!("{}.tmp", &file_name));
    let new_file_path = dir.join(&file_name);
    fs::rename(temp_file_path, new_file_path)?;

    Ok(())
}

pub fn get_saved_processed_data(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str) -> Result<EntryStats, Error> {
    let dir = get_base_dir(&app, year, month);
    let file_path = dir.join(&file_name);
    let contents = fs::read(file_path)?;
    let processed_data: EntryStats = serde_json::from_slice(&contents)?;

    Ok(processed_data)
}
