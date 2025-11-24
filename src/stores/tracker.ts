import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TrackTotals { msPlayed: number; playCount: number; }
export type TotalsList = [ string, TrackTotals ][];
export interface YearlyTotals { [year: string]: TotalsList; }
export interface MonthlyTotals { [year: string]: { [month: string]: TotalsList }; }

export interface TrackData {
  id: string;
  key?: string;
  trackName: string;
  artistName: string;
  albumName: string;
  playCount?: number;
  firstPlayed?: string;
}
export interface Entry {
  msPlayed: number;
  timePlayed?: string;
  timeStamp: string;
  dateString?: string;
  timeString?: string;
}
export interface TrackStats {
  [key: string]: {
    info: TrackData,
    plays: Entry[],
    computed?: boolean,
    firstPlayed?: string,
  }
}
export interface ArtistStats { 
  [artistName: string]: {
    name: string,
    tracks: TrackStats,
    computed?: boolean,
    topTracks: TrackData[],
    firstTracks: TrackData[],
    totalPlays: number,
    timePlayed?: string,
  }
};

export const useTrackerStore = defineStore('tracker', () => {
  const yearlyTopTracks = ref<YearlyTotals>({});
  const monthlyTopTracks = ref<MonthlyTotals>({});
  const yearlyTopArtists = ref<YearlyTotals>({});
  const monthlyTopArtists = ref<MonthlyTotals>({});
  const fullTrackStats = ref<TrackStats>({});
  const fullArtistStats = ref<ArtistStats>({});

  const getTopTracks = async (year : string, month : string | undefined = undefined) => {
    try {
        if (month) {
        if (monthlyTopTracks.value[year] && monthlyTopTracks.value[year][month]) {
          return monthlyTopTracks.value[year][month];
        }
        const module = await import(`../assets/data/processed/yearly/${year}/${month}/topSongs.json`)
        if (!monthlyTopTracks.value[year]) {
          monthlyTopTracks.value[year] = {};
        }
        monthlyTopTracks.value[year][month] = module.default;
        return monthlyTopTracks.value[year][month];
      }
      
      if (yearlyTopTracks.value[year]) {
        return yearlyTopTracks.value[year];
      }
      const module = await import(`../assets/data/processed/yearly/${year}/topSongs.json`);
      yearlyTopTracks.value[year] = module.default as TotalsList;
      return yearlyTopTracks.value[year];
    } catch (error) {
      console.log(`Error loading top tracks for ${year}${month ? `/${month}` : ''}`);
      return [];
    }
  }

  const getTopArtists = async (year : string, month : string | undefined = undefined) => {
    try {
      if (month) {
        if (monthlyTopArtists.value[year] && monthlyTopArtists.value[year][month]) {
          return monthlyTopArtists.value[year][month];
        }
        const module = await import(`../assets/data/processed/yearly/${year}/${month}/topArtists.json`)
        if (!monthlyTopArtists.value[year]) {
          monthlyTopArtists.value[year] = {};
        }
        monthlyTopArtists.value[year][month] = module.default;
        return monthlyTopArtists.value[year][month];
      }
      
      if (yearlyTopArtists.value[year]) {
        return yearlyTopArtists.value[year];
      }
      const module = await import(`../assets/data/processed/yearly/${year}/topArtists.json`);
      yearlyTopArtists.value[year] = module.default as TotalsList;
      return yearlyTopArtists.value[year];
    } catch (error) {
      console.log(`Error loading top artists for ${year}${month ? `/${month}` : ''}`);
      return [];
    }
  }

  const getTopItems = async (type : 'tracks' | 'artists', from : string, to : string) => {
    const fromParts = from.split('-');
    const fromMonth = parseInt(fromParts[0], 10);
    const fromYear = parseInt(fromParts[1], 10);
    const toParts = to.split('-');
    const toMonth = parseInt(toParts[0], 10);
    const toYear = parseInt(toParts[1], 10);
    const combinedTotals: TotalsList = [];

    for (let year = fromYear; year <= toYear; year += 1) {
      if (year > fromYear && year < toYear) {
        const yearlyData = type === 'tracks' ? await getTopTracks(year.toString()) : await getTopArtists(year.toString());
        yearlyData.forEach(([trackKey, totals]) => {
          const existingEntry = combinedTotals.find(entry => entry[0] === trackKey);
          if (existingEntry) {
            existingEntry[1].msPlayed += totals.msPlayed;
            existingEntry[1].playCount += totals.playCount;
          } else {
            combinedTotals.push([trackKey, { msPlayed: totals.msPlayed, playCount: totals.playCount }]);
          }
        });
        continue;
      }

      const startMonth = (year === fromYear) ? fromMonth : 1;
      const endMonth = (year === toYear) ? toMonth : 12;
      for (let month = startMonth; month <= endMonth; month += 1) {
        const monthlyData = type === 'tracks' ? await getTopTracks(year.toString(), month.toString()) : await getTopArtists(year.toString(), month.toString());
        monthlyData.forEach(([trackKey, totals]) => {
          const existingEntry = combinedTotals.find(entry => entry[0] === trackKey);
          if (existingEntry) {
            existingEntry[1].msPlayed += totals.msPlayed;
            existingEntry[1].playCount += totals.playCount;
          } else {
            combinedTotals.push([trackKey, { msPlayed: totals.msPlayed, playCount: totals.playCount }]);
          }
        });
      }
    }

    combinedTotals.sort((a, b) => b[1].playCount - a[1].playCount);
    return combinedTotals;
  }

  const getTrackStats = async (trackKey: string) => {
    if (!fullTrackStats.value || Object.keys(fullTrackStats.value).length === 0) {
      const module = await import(`../assets/data/processed/fullSongStats.json`);
      fullTrackStats.value = module.default as TrackStats;
    }

    if (!fullTrackStats.value[trackKey]) {
      return;
    }
    if (fullTrackStats.value[trackKey].computed) {
      return fullTrackStats.value[trackKey];
    }

    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const timeOptions = { hour: 'numeric', minute: '2-digit' } as const;
    fullTrackStats.value[trackKey].plays = fullTrackStats.value[trackKey].plays.map(play => {
      const date = new Date(play.timeStamp);
      
      const minutesPlayed = Math.floor(play.msPlayed / 60000);
      const secondsPlayed = Math.floor((play.msPlayed % 60000) / 1000);

      return { 
        ...play,
        dateString: date.toLocaleDateString('en-US', dateOptions),
        timeString: date.toLocaleTimeString('en-US', timeOptions),
        timePlayed: `${minutesPlayed}m ${secondsPlayed}s`,
      };
    }).reverse();
    const firstTimestamp = fullTrackStats.value[trackKey].plays[fullTrackStats.value[trackKey].plays.length - 1].timeStamp;
    fullTrackStats.value[trackKey].firstPlayed = new Date(firstTimestamp).toLocaleDateString('en-US', dateOptions);
    fullTrackStats.value[trackKey].computed = true;
    return fullTrackStats.value[trackKey];
  }

  const getArtistStats = async (artistName: string) => {
    if (!fullArtistStats.value || Object.keys(fullArtistStats.value).length === 0) {
      const module = await import(`../assets/data/processed/fullArtistStats.json`);
      const fullStats = module.default as ({ [artist: string]: TrackStats });
      if (!fullStats[artistName]) return;

      Object.keys(fullStats).forEach(artist => {
        if (!fullArtistStats.value[artist]) {
          fullArtistStats.value[artist] = { name: artist, tracks: {}, totalPlays: 0, topTracks: [], firstTracks: []  };
        }
        fullArtistStats.value[artist].tracks = fullStats[artist] as TrackStats;
      });
    }

    if (fullArtistStats.value[artistName].computed) {
      return fullArtistStats.value[artistName];
    }
    console.log(`Computing stats for artist: ${artistName}`);
    
    const artistStats = fullArtistStats.value[artistName];
    Object.entries(artistStats.tracks).sort((a, b) => b[1].plays.length - a[1].plays.length).forEach(([key, entry]) => {
      artistStats.topTracks.push({ ...entry.info, key, playCount: entry.plays.length });
    });
  
    let firstTimestamps : { [key : string]: number } = {};
    artistStats.totalPlays = 0;
    let totalMsPlayed = 0;
    Object.keys(artistStats.tracks).forEach(key => {
      firstTimestamps[key] = artistStats.tracks[key].plays.map(play => new Date(play.timeStamp).getTime()).sort((a, b) => a - b)[0];
      artistStats.totalPlays += artistStats.tracks[key].plays.length;
      totalMsPlayed += artistStats.tracks[key].plays.reduce((sum, play) => sum + play.msPlayed, 0);
    });
    const totalHours = Math.floor(totalMsPlayed / 3600000);
    const totalMinutes = Math.floor((totalMsPlayed % 3600000) / 60000);
    const totalSeconds = Math.floor((totalMsPlayed % 60000) / 1000);
    artistStats.timePlayed = `${totalHours}h ${totalMinutes}m ${totalSeconds}s`;

    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    Object.entries(firstTimestamps).sort((a, b) => (a[1] - b[1])).forEach(([key, timeStamp]) => {
      const date = new Date(timeStamp);
      artistStats.firstTracks.push({ ...artistStats.tracks[key].info, key, firstPlayed: date.toLocaleDateString('en-US', dateOptions) });
    });
    fullArtistStats.value[artistName] = artistStats
    fullArtistStats.value[artistName].computed = true;
    return artistStats;
  }

  return {
    getTopTracks,
    getTopItems,
    getTopArtists,
    getTrackStats,
    getArtistStats
  }
});
