use std::{fs::{self}, path::PathBuf};

use tauri::{Error, Manager};

use crate::models::{Entry, EntryStats, RawTrackData};

const RAW_HISTORY: &str = "raw_history";
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

pub fn get_base_dir(app: &tauri::AppHandle, year: i32, month: Option<u32>) -> PathBuf {
    let base = app.path().app_data_dir().unwrap();
    let mut dir = base.join(PROCESSED_HISTORY).join(year.to_string());

    if let Some(month) = month {
        dir = dir.join(month.to_string());
    }

    dir
}

pub fn rename_raw_dir(app: &tauri::AppHandle) -> Result<(), Error> {
    let base = app.path().app_data_dir().unwrap();
    fs::remove_dir_all(base.join(format!("{}.tmp", RAW_HISTORY)))?;
    fs::rename(base.join(RAW_HISTORY), base.join(format!("{}.tmp", RAW_HISTORY)))?;

    Ok(())
}

pub fn rename_processed_dir(app: &tauri::AppHandle) -> Result<(), Error> {
    let base = app.path().app_data_dir().unwrap();
    fs::remove_dir_all(base.join(format!("{}.tmp", PROCESSED_HISTORY)))?;
    fs::rename(base.join(PROCESSED_HISTORY), base.join(format!("{}.tmp", PROCESSED_HISTORY)))?;

    Ok(())
}

pub fn create_stats_dir(app: &tauri::AppHandle, year: i32, month: Option<u32>) -> Result<(), Error> {
    let dir = get_base_dir(&app, year, month);
    fs::create_dir_all(&dir)?;

    Ok(())
}

pub fn get_years_dir_names(app: &tauri::AppHandle) -> Result<Vec<i32>, Error> {
    let base = app.path().app_data_dir().unwrap();
    let dir = base.join(PROCESSED_HISTORY);
    let contents = fs::read_dir(dir)?;
    let dir_names: Vec<i32> = contents
        .filter_map(Result::ok)
        .filter(|entry| entry.path().is_dir())
        .filter_map(|entry| {
            entry.file_name()
                .to_str()?
                .parse::<i32>()
                .ok()
        })
        .collect();

    Ok(dir_names)
}

pub fn get_months_dir_names(app: &tauri::AppHandle, year: i32) -> Result<Vec<u32>, Error> {
    let dir = get_base_dir(app, year, None);
    let contents = fs::read_dir(dir)?;
    let dir_names: Vec<u32> = contents
        .filter_map(Result::ok)
        .filter(|entry| entry.path().is_dir())
        .filter_map(|entry| {
            entry.file_name()
                .to_str()?
                .parse::<u32>()
                .ok()
        })
        .collect();

    Ok(dir_names)
}

pub fn save_processed_data(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str, data: &EntryStats) {
    let result = (|| -> Result<(), Error> {
        let dir = get_base_dir(&app, year, month);
        fs::create_dir_all(&dir)?;
        let json = serde_json::to_string_pretty(&data)?;
        let file_path = dir.join(&file_name);
        fs::write(file_path, json)?;

        Ok(())
    })();

    if let Err(e) = result {
        eprintln!("Unable to save {} for {}-{}: {}", file_name, year, month.unwrap_or(0), e);
    }
}

pub fn rename_temp_file(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str) {
    let result = (|| -> Result<(), Error> {
        let dir = get_base_dir(&app, year, month);
        let temp_file_path = dir.join(format!("{}.tmp", &file_name));
        let new_file_path = dir.join(&file_name);
        fs::rename(temp_file_path, new_file_path)?;

        Ok(())
    })();

    if let Err(e) = result {
        eprintln!("Unable to rename {}.tmp for {}-{}: {}", file_name, year, month.unwrap_or(0), e);
    }
}

pub fn get_saved_processed_data(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str) -> Result<EntryStats, Error> {
    let dir = get_base_dir(&app, year, month);
    let file_path = dir.join(&file_name);
    let contents = fs::read(file_path)?;
    let processed_data: EntryStats = serde_json::from_slice(&contents)?;

    Ok(processed_data)
}

pub fn save_top_items_data(app: &tauri::AppHandle, year: i32, month: Option<u32>, file_name: &str, data: &Vec<(&String, &Entry)>) {
    let result = (|| -> Result<(), Error> {
        let dir = get_base_dir(&app, year, month);
        fs::create_dir_all(&dir)?;
        let json = serde_json::to_string_pretty(&data)?;
        let file_path = dir.join(&file_name);
        fs::write(file_path, json)?;

        Ok(())
    })();

    if let Err(e) = result {
        eprintln!("Unable to save {} for {}-{}: {}", file_name, year, month.unwrap_or(0), e);
    }
}
