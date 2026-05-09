use std::{fs::{self, File}, io::Read, time::{SystemTime, UNIX_EPOCH}};
use chrono::{DateTime, Datelike, Local};
use tauri::{async_runtime::spawn_blocking};
use tauri_plugin_store::StoreExt;
use zip::{ZipArchive, result::ZipError};

use crate::{
    file::{create_stats_dir, get_raw_history, get_saved_processed_data, rename_temp_file, save_processed_data, save_raw_track_data},
    models::{Entry, EntryStats, MonthlyStats, RawTrackData, TrackData, TrackEntryData, YearlyStats}
};

mod models;
mod file;

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
    Store(#[from] tauri_plugin_store::Error),
    #[error("Chrono Parse error: {0}")]
    Chrono(#[from] chrono::ParseError)
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
                    
                    store.set(file_name.to_lowercase(), "uploaded");
                    save_raw_track_data(&app, &file_name, &data)?;
                }
            }
        }
        store.save()?;

        Ok::<_, AppError>(format!("Successfully read {} files from archive", archive.len()))
    }).await.map_err(|e| AppError::Join(e.to_string()))??;

    Ok(result)
}

#[tauri::command]
async fn process_raw_history(app: tauri::AppHandle) -> Result<String, AppError> {
    println!("Received process request");
    let store = app.store("store.json")?;
    let already_processed = store.get("full-history-processed").and_then(|v| v.as_bool()).unwrap_or(false);
    if already_processed {
        return Ok::<_, AppError>("Extended History already processed".to_string());
    }

    let result: String = spawn_blocking(move || -> Result<String, AppError> {
        let raw_json_files = get_raw_history(&app)?;
        for raw_entry in &raw_json_files {
            let file_name = raw_entry.file_name().unwrap().to_string_lossy();
            let status: String = store.get(file_name.to_lowercase()).and_then(|v| v.as_str().map(str::to_owned)).unwrap_or("unknown".to_owned());
            if status == "processed" {
                continue;
            }
            store.set(file_name.to_lowercase(), "processing");
            println!("Processing {}", file_name);

            let contents = fs::read(raw_entry.as_path())?;
            let raw_track_data: Vec<RawTrackData> = serde_json::from_slice(&contents)?;
            let track_data: Vec<TrackEntryData> = raw_track_data
                .into_iter()
                .filter_map(|e: models::RawTrackData| {
                    return Some(TrackEntryData {
                        track: TrackData {
                            id: e.spotify_track_uri?,
                            track_name: e.master_metadata_track_name?,
                            artist_name: e.master_metadata_album_artist_name?,
                            album_name: e.master_metadata_album_album_name?,
                        },
                        time_stamp: e.ts?,
                        ms_played: e.ms_played?
                    })
                })
                .collect();
            
            let mut yearly_track_stats: YearlyStats = YearlyStats::new();
            let mut yearly_artist_stats: YearlyStats = YearlyStats::new();
            let mut yearly_album_stats: YearlyStats = YearlyStats::new();
            let mut yearly_per_day_stats: YearlyStats = YearlyStats::new();
            let mut yearly_per_month_stats: MonthlyStats = MonthlyStats::new();
            for entry in track_data {
                if entry.ms_played < 30000 {
                    continue;
                }

                let date = DateTime::parse_from_rfc3339(&entry.time_stamp)?.with_timezone(&Local);
                let year = date.year();
                let month = date.month();
                let day = date.day();

                let track_stats: &mut EntryStats = yearly_track_stats
                    .entry(year)
                    .or_insert_with(MonthlyStats::new)
                    .entry(month)
                    .or_insert_with(|| {
                        create_stats_dir(&app, year, Some(month)).unwrap();

                        get_saved_processed_data(&app, year, Some(month), "track_stats.json").unwrap_or_else(|_| EntryStats::new())
                    });
                let track_key = format!("{} - {}", entry.track.track_name, entry.track.artist_name);
                let track_entry = track_stats.entry(track_key).or_insert(Entry { ms_played: 0, play_count: 0 });
                track_entry.play_count += 1;
                track_entry.ms_played += entry.ms_played;

                let artist_stats: &mut EntryStats = yearly_artist_stats
                    .entry(year)
                    .or_insert_with(MonthlyStats::new)
                    .entry(month)
                    .or_insert_with(|| {
                        get_saved_processed_data(&app, year, Some(month), "artist_stats.json").unwrap_or_else(|_| EntryStats::new())
                    });
                let artist_key = format!("{}", entry.track.artist_name);
                let artist_entry = artist_stats.entry(artist_key).or_insert(Entry { ms_played: 0, play_count: 0 });
                artist_entry.play_count += 1;
                artist_entry.ms_played += entry.ms_played;
                
                let album_stats: &mut EntryStats = yearly_album_stats
                    .entry(year)
                    .or_insert_with(MonthlyStats::new)
                    .entry(month)
                    .or_insert_with(|| {
                        get_saved_processed_data(&app, year, Some(month), "album_stats.json").unwrap_or_else(|_| EntryStats::new())
                    });
                let album_key = format!("{} - {}", entry.track.album_name, entry.track.artist_name);
                let album_entry = album_stats.entry(album_key).or_insert(Entry { ms_played: 0, play_count: 0 });
                album_entry.play_count += 1;
                album_entry.ms_played += entry.ms_played;
                
                let per_day_stats: &mut EntryStats = yearly_per_day_stats
                    .entry(year)
                    .or_insert_with(MonthlyStats::new)
                    .entry(month)
                    .or_insert_with(|| {
                        get_saved_processed_data(&app, year, Some(month), "per_day_stats.json").unwrap_or_else(|_| EntryStats::new())
                    });
                let per_day_entry = per_day_stats.entry(day.to_string()).or_insert(Entry { ms_played: 0, play_count: 0 });
                per_day_entry.play_count += 1;
                per_day_entry.ms_played += entry.ms_played;
                
                let per_month_stats: &mut EntryStats = yearly_per_month_stats
                    .entry(year as u32)
                    .or_insert_with(|| {
                        get_saved_processed_data(&app, year, None, "per_month_stats.json").unwrap_or_else(|_| EntryStats::new())
                    });
                let per_month_entry = per_month_stats.entry(month.to_string()).or_insert(Entry { ms_played: 0, play_count: 0 });
                per_month_entry.play_count += 1;
                per_month_entry.ms_played += entry.ms_played;
            }

            for (yearly_stats, file_name) in [
                (&yearly_track_stats, "track_stats.json.tmp"),
                (&yearly_artist_stats, "artist_stats.json.tmp"),
                (&yearly_album_stats, "album_stats.json.tmp"),
                (&yearly_per_day_stats, "per_day_stats.json.tmp"),
            ] {
                for (year, monthly_stats) in yearly_stats {
                    for (month, stats) in monthly_stats {
                        save_processed_data(&app, *year, Some(*month), file_name, stats)?;
                    }
                }
            }
            for (year, per_month_stats) in yearly_per_month_stats {
                save_processed_data(&app, year as i32, None, "per_month_stats.json.tmp", &per_month_stats)?;
            }
            for (year, monthly_stats) in &yearly_track_stats {
                for (month, _) in monthly_stats {
                    rename_temp_file(&app, *year, Some(*month), "track_stats.json")?;
                    rename_temp_file(&app, *year, Some(*month), "artist_stats.json")?;
                    rename_temp_file(&app, *year, Some(*month), "album_stats.json")?;
                    rename_temp_file(&app, *year, Some(*month), "per_day_stats.json")?;
                }
                store.set(format!("{}-top-items", year), "reset");
                rename_temp_file(&app, *year, None, "per_month_stats.json")?;
            }
            store.set(file_name.to_lowercase(), "processed");
            store.save()?;
        }

        store.set("full-history-processed", true);
        store.save()?;

        Ok::<_, AppError>(format!("Successfully processed {} files from raw history", &raw_json_files.len()))
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
        .invoke_handler(tauri::generate_handler![greet, process_zip_file, process_raw_history])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
