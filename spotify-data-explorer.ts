const fs = require('fs');

type SongData = {
  id: string;
  trackName: string;
  artistName: string;
  albumName: string;
}

type Entry = { msPlayed: number; playCount: number; }

type SongEntryData = {
  song: SongData;
  timeStamp: string;
  msPlayed: number;
}

type YearlyStats = {
  [year: string]: {
    [month: number]: {
      [key: string]: {
        msPlayed: number;
        playCount: number;
      };
    }
  }
};

type SongStats = {
  [key: string]: {
    info: SongData,
    plays: {
      timeStamp: string;
      msPlayed: number;
    }[]
  }
}
type ArtistStats = { [artistName: string]: SongStats };
type AlbumStats = { [albumName: string]: SongStats };

const EXTENDED_HISTORY_PATH = './data/Spotify Extended Streaming History/';
const PROCESSSED_DATA_PATH = './data/processed';
const FULL_SONGS_STATS_PATH = './data/processed/fullSongStats.json';
const FULL_ARTISTS_STATS_PATH = './data/processed/fullArtistStats.json';
const FULL_ALBUM_STATS_PATH = './data/processed/fullAlbumStats.json';
const YEARLY_DATA_PATH = (year : string | number) => `${PROCESSSED_DATA_PATH}/yearly/${year}`;
const MONTHLY_DATA_PATH = (year : string | number, month: string | number) => `${YEARLY_DATA_PATH(year)}/${month}`;
const SONG_STATS_PATH = (year : string | number, month: string | number) => `${MONTHLY_DATA_PATH(year, month)}/songStats.json`;
const ARTIST_STATS_PATH = (year : string | number, month: string | number) => `${MONTHLY_DATA_PATH(year, month)}/artistStats.json`;
const ALBUM_STATS_PATH = (year : string | number, month: string | number) => `${MONTHLY_DATA_PATH(year, month)}/albumStats.json`;

const processExtendedData = () => {
  let songStats = {} as SongStats;
  let artistStats = {} as ArtistStats;
  let albumStats = {} as ArtistStats;
  const yearlySongStats = {} as YearlyStats;
  const yearlyArtistStats = {} as YearlyStats;
  const yearlyAlbumStats = {} as YearlyStats;

  const files = fs.readdirSync(EXTENDED_HISTORY_PATH, { withFileTypes: true });
  files.forEach((file : any) => {
    if (file.isFile() && file.name.startsWith('Streaming_History_Audio_') && file.name.endsWith('.json')) {
      const fileData = fs.readFileSync(EXTENDED_HISTORY_PATH + file.name, 'utf8');
      const songData = JSON.parse(fileData).map((entry: any) : SongEntryData => {
        return {
          song: {
            id: entry.spotify_track_uri,
            trackName: entry.master_metadata_track_name,
            artistName: entry.master_metadata_album_artist_name,
            albumName: entry.master_metadata_album_album_name,
          },
          timeStamp: entry.ts,
          msPlayed: entry.ms_played,
        };
      }).filter((entry : SongEntryData) => entry.song.id);
      
      songData.forEach((entry: SongEntryData) => {
        if (entry.msPlayed < 30000) return;
        const date = new Date(entry.timeStamp);
        const year = date.getFullYear().toString();
        let month = (date.getMonth() + 1);

        const songKey = `${entry.song.trackName} - ${entry.song.artistName}`;
        const albumKey = `${entry.song.albumName} - ${entry.song.artistName}`;

        if (!yearlySongStats[year]) yearlySongStats[year] = {};
        if (!yearlySongStats[year][month]) yearlySongStats[year][month] = {};
        if (!yearlySongStats[year][month][songKey]) yearlySongStats[year][month][songKey] = { msPlayed: 0, playCount: 0 };
        yearlySongStats[year][month][songKey].msPlayed += entry.msPlayed;
        yearlySongStats[year][month][songKey].playCount += 1;

        if (!yearlyArtistStats[year]) yearlyArtistStats[year] = {};
        if (!yearlyArtistStats[year][month]) yearlyArtistStats[year][month] = {};
        if (!yearlyArtistStats[year][month][entry.song.artistName]) yearlyArtistStats[year][month][entry.song.artistName] = { msPlayed: 0, playCount: 0 };
        yearlyArtistStats[year][month][entry.song.artistName].msPlayed += entry.msPlayed;
        yearlyArtistStats[year][month][entry.song.artistName].playCount += 1;

        if (!yearlyAlbumStats[year]) yearlyAlbumStats[year] = {};
        if (!yearlyAlbumStats[year][month]) yearlyAlbumStats[year][month] = {};
        if (!yearlyAlbumStats[year][month][albumKey]) yearlyAlbumStats[year][month][albumKey] = { msPlayed: 0, playCount: 0 };
        yearlyAlbumStats[year][month][albumKey].msPlayed += entry.msPlayed;
        yearlyAlbumStats[year][month][albumKey].playCount += 1;

        if (!songStats[songKey]) songStats[songKey] = { info: entry.song, plays: [] };
        songStats[songKey].plays.push({
          timeStamp: entry.timeStamp,
          msPlayed: entry.msPlayed,
        });

        if (!artistStats[entry.song.artistName]) artistStats[entry.song.artistName] = {};
        if (!artistStats[entry.song.artistName][songKey]) artistStats[entry.song.artistName][songKey] = { info: entry.song, plays: [] };
        artistStats[entry.song.artistName][songKey].plays.push({
          timeStamp: entry.timeStamp,
          msPlayed: entry.msPlayed,
        });

        if (!albumStats[albumKey]) albumStats[albumKey] = {};
        if (!albumStats[albumKey][songKey]) albumStats[albumKey][songKey] = { info: entry.song, plays: [] };
        albumStats[albumKey][songKey].plays.push({
          timeStamp: entry.timeStamp,
          msPlayed: entry.msPlayed,
        });
      });
    }
  });

  if (!fs.existsSync(PROCESSSED_DATA_PATH)) fs.mkdirSync(PROCESSSED_DATA_PATH);
  if (!fs.existsSync(PROCESSSED_DATA_PATH + '/yearly')) fs.mkdirSync(PROCESSSED_DATA_PATH + '/yearly');
  for (const year in yearlySongStats) {
    if (!fs.existsSync(YEARLY_DATA_PATH(year))) fs.mkdirSync(YEARLY_DATA_PATH(year));
    for (const month in yearlySongStats[year]) {
      if (!fs.existsSync(MONTHLY_DATA_PATH(year, month))) fs.mkdirSync(MONTHLY_DATA_PATH(year, month));
      fs.writeFileSync(SONG_STATS_PATH(year, month), JSON.stringify(yearlySongStats[year][month], null, 2));
      fs.writeFileSync(ARTIST_STATS_PATH(year, month), JSON.stringify(yearlyArtistStats[year][month], null, 2));
      fs.writeFileSync(ALBUM_STATS_PATH(year, month), JSON.stringify(yearlyAlbumStats[year][month], null, 2));
    }
  }
  fs.writeFileSync(FULL_SONGS_STATS_PATH, JSON.stringify(songStats, null, 2));
  fs.writeFileSync(FULL_ARTISTS_STATS_PATH, JSON.stringify(artistStats, null, 2));
  fs.writeFileSync(FULL_ALBUM_STATS_PATH, JSON.stringify(albumStats, null, 2));
}

processExtendedData();

const saveTopItemsData = () => {
  const yearFolders = fs.readdirSync(`${PROCESSSED_DATA_PATH}/yearly/`, { withFileTypes: true }).filter((d:any) => d.isDirectory()).map((d:any) => d.name);
  yearFolders.forEach((year : string) => {
    const yearlySongAggregates: { [key: string]: Entry } = {};
    const yearlyArtistAggregates: { [key: string]: Entry } = {};
    const yearlyAlbumAggregates: { [key: string]: Entry } = {};

    const monthFolders = fs.readdirSync(YEARLY_DATA_PATH(year), { withFileTypes: true }).filter((d:any) => d.isDirectory()).map((d:any) => parseInt(d.name, 10));
    monthFolders.forEach((month : number) => {
      const monthlySongAggregates: { [key: string]: Entry } = {};
      const monthlyArtistAggregates: { [key: string]: Entry } = {};
      const monthlyAlbumAggregates: { [key: string]: Entry } = {};

      const songStats = JSON.parse(fs.readFileSync(SONG_STATS_PATH(year, month), 'utf8')) as YearlyStats[''][0];
      for (const key in songStats) {
        if (!yearlySongAggregates[key]) yearlySongAggregates[key] = { msPlayed: 0, playCount: 0 };
        yearlySongAggregates[key].msPlayed += songStats[key].msPlayed;
        yearlySongAggregates[key].playCount += songStats[key].playCount;
        if (!monthlySongAggregates[key]) monthlySongAggregates[key] = { msPlayed: 0, playCount: 0 };
        monthlySongAggregates[key].msPlayed += songStats[key].msPlayed;
        monthlySongAggregates[key].playCount += songStats[key].playCount;
      }

      const artistStats = JSON.parse(fs.readFileSync(ARTIST_STATS_PATH(year, month), 'utf8')) as YearlyStats[''][0];
      for (const key in artistStats) {
        if (!yearlyArtistAggregates[key]) yearlyArtistAggregates[key] = { msPlayed: 0, playCount: 0 };
        yearlyArtistAggregates[key].msPlayed += artistStats[key].msPlayed;
        yearlyArtistAggregates[key].playCount += artistStats[key].playCount;
        if (!monthlyArtistAggregates[key]) monthlyArtistAggregates[key] = { msPlayed: 0, playCount: 0 };
        monthlyArtistAggregates[key].msPlayed += artistStats[key].msPlayed;
        monthlyArtistAggregates[key].playCount += artistStats[key].playCount;
      }

      const albumStats = JSON.parse(fs.readFileSync(ALBUM_STATS_PATH(year, month), 'utf8')) as YearlyStats[''][0];
      for (const key in albumStats) {
        if (!yearlyAlbumAggregates[key]) yearlyAlbumAggregates[key] = { msPlayed: 0, playCount: 0 };
        yearlyAlbumAggregates[key].msPlayed += albumStats[key].msPlayed;
        yearlyAlbumAggregates[key].playCount += albumStats[key].playCount;
        if (!monthlyAlbumAggregates[key]) monthlyAlbumAggregates[key] = { msPlayed: 0, playCount: 0 };
        monthlyAlbumAggregates[key].msPlayed += albumStats[key].msPlayed;
        monthlyAlbumAggregates[key].playCount += albumStats[key].playCount;
      }

      let sortedSongs = Object.entries(monthlySongAggregates).sort((a, b) => b[1].playCount - a[1].playCount);
      fs.writeFileSync(`${MONTHLY_DATA_PATH(year, month)}/topSongs.json`, JSON.stringify(sortedSongs, null, 2));
      let sortedArtists = Object.entries(monthlyArtistAggregates).sort((a, b) => b[1].playCount - a[1].playCount);
      fs.writeFileSync(`${MONTHLY_DATA_PATH(year, month)}/topArtists.json`, JSON.stringify(sortedArtists, null, 2));
      let sortedAlbums = Object.entries(monthlyAlbumAggregates).sort((a, b) => b[1].playCount - a[1].playCount);
      fs.writeFileSync(`${MONTHLY_DATA_PATH(year, month)}/topAlbums.json`, JSON.stringify(sortedAlbums, null, 2));
    });

    let sortedSongs = Object.entries(yearlySongAggregates).sort((a, b) => b[1].playCount - a[1].playCount);
    fs.writeFileSync(`${YEARLY_DATA_PATH(year)}/topSongs.json`, JSON.stringify(sortedSongs, null, 2));
    let sortedArtists = Object.entries(yearlyArtistAggregates).sort((a, b) => b[1].playCount - a[1].playCount);
    fs.writeFileSync(`${YEARLY_DATA_PATH(year)}/topArtists.json`, JSON.stringify(sortedArtists, null, 2));
    let sortedAlbums = Object.entries(yearlyAlbumAggregates).sort((a, b) => b[1].playCount - a[1].playCount);
    fs.writeFileSync(`${YEARLY_DATA_PATH(year)}/topAlbums.json`, JSON.stringify(sortedAlbums, null, 2));
  });
}

saveTopItemsData();

const getTopItemsForYear = (items: 'songs' | 'artists' | 'albums', year: string | number, limit = 5, recalculate = false) => {
  const itemsName = items.charAt(0).toUpperCase() + items.slice(1);
  const fileName = `${YEARLY_DATA_PATH(year)}/top${itemsName}.json`;
  let sortedItems : ([ string, Entry ])[] = JSON.parse(fs.readFileSync(fileName));;
  console.log(`\nTop ${items} for year ${year}:`);
  sortedItems.slice(0, limit).forEach(([key, entry]) => {
    console.log(`${key} - ${entry.playCount} plays in ${(entry.msPlayed / 60000).toFixed(2)} minutes`);
  });
}

// for (let year = 2024; year <= 2025; year++) {
//   console.log(`\n=== Stats for ${year} ===`);
//   getTopItemsForYear('songs', year, 5, true);
//   getTopItemsForYear('artists', year, 5, true);
//   getTopItemsForYear('albums', year, 5, true);
// }

const getTopItems = (items: 'songs' | 'artists' | 'albums', limit = 5, fromMonth = 0, fromYear = 0, toMonth = 0, toYear = 0) => {
  const yearFolders = fs.readdirSync(`${PROCESSSED_DATA_PATH}/yearly/`, { withFileTypes: true }).filter((d:any) => d.isDirectory()).map((d:any) => d.name);
  const aggregates: { [key: string]: Entry } = {};
  yearFolders.forEach((year : any) => {
    if (fromYear && parseInt(year) < fromYear) return;
    if (toYear && parseInt(year) > toYear) return;
    const monthFolders = fs.readdirSync(YEARLY_DATA_PATH(year), { withFileTypes: true }).filter((d:any) => d.isDirectory()).map((d:any) => parseInt(d.name, 10));
    monthFolders.forEach((month : number) => {
      if (fromMonth && parseInt(year) === fromYear && month < fromMonth) return;
      if (toMonth && parseInt(year) === toYear && month > toMonth) return;
      let statsFileName = `${MONTHLY_DATA_PATH(year, month)}/${items.substring(0, items.length - 1)}Stats.json`
      const monthlyData = JSON.parse(fs.readFileSync(statsFileName, 'utf8')) as YearlyStats[''][0];
      for (const key in monthlyData) {
        if (!aggregates[key]) aggregates[key] = { msPlayed: 0, playCount: 0 };
        aggregates[key].msPlayed += monthlyData[key].msPlayed;
        aggregates[key].playCount += monthlyData[key].playCount;
      }
    });
  });
  let sortedItems = Object.entries(aggregates).sort((a, b) => b[1].playCount - a[1].playCount);
  let message = `\nTop ${items}`;
  if (fromMonth || fromYear) {
    message += ' since ';
    if (fromMonth) message += fromMonth + '/';
    if (fromYear) message += fromYear;
  }
  if (toMonth || toYear) {
    message += ' upto ';
    if (toMonth) message += toMonth + '/';
    if (toYear) message += toYear;
  }
  if (!fromYear && !toYear) message += ' of all time'
  message += ':';
  console.log(message);
  sortedItems.slice(0, limit).forEach(([key, entry]) => {
    console.log(`${key} - ${entry.playCount} plays`);
  });
}

getTopItems('songs', 5, 1, 2021);
getTopItems('artists', 5, 1, 2021);
getTopItems('albums', 5, 1, 2021);

const getTopSongsBy = (artistName: string, limit=10) => {
  const statsFile = FULL_ARTISTS_STATS_PATH;
  if (!fs.existsSync(statsFile)) {
    console.log('Processed data does not exist');
    return;
  }

  const artistData = JSON.parse(fs.readFileSync(statsFile)) as ArtistStats;
  const songs = artistData[artistName];
  if (!songs) {
    console.log(`Artist ${artistName} not found`);
    return;
  }
  const sortedSongs = Object.entries(songs).sort((a, b) => b[1].plays.length - a[1].plays.length);
  console.log(`\nTop songs by ${artistName} of all time:`);
  sortedSongs.slice(0, limit).forEach(([key, entry]) => {
    console.log(`${key} - ${entry.plays.length} plays`);
  });
}

// const args = process.argv.slice(2);
// const artists = args[0].split(',')
// artists.forEach(artist => getTopSongsBy(artist));

const getFirstSongsBy = (artistName: string, limit=10) => {
  const statsFile = FULL_ARTISTS_STATS_PATH;
  if (!fs.existsSync(statsFile)) {
    console.log('Processed data does not exist');
    return;
  }

  const artistData = JSON.parse(fs.readFileSync(statsFile)) as ArtistStats;
  const songs = artistData[artistName];
  if (!songs) {
    console.log(`Artist ${artistName} not found`);
    return;
  }
  let firstTimestamps : { [key : string]: number } = {};
  Object.keys(songs).forEach(key => {
    const songData = songs[key];
    firstTimestamps[songData.info.trackName] = songData.plays.map(play => new Date(play.timeStamp).getTime()).sort((a, b) => a - b)[0];
  });
  const sortedSongs = Object.entries(firstTimestamps).sort((a, b) => (a[1] - b[1]));
  console.log(`\nFirst songs you listened to by ${artistName}:`);
  sortedSongs.slice(0, limit).forEach(([key, timeStamp]) => {
    const date = new Date(timeStamp);
    console.log(`${key} - ${date.toDateString()}, ${date.toTimeString()}`);
  });
}

// const args = process.argv.slice(2);
// const artists = args[0].split(',')
// artists.forEach(artist => getFirstSongsBy(artist));
