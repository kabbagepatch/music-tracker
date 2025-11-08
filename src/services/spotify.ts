import axios from "axios";
import { getUserAccessToken } from "./connectToSpotify";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export const getAccessToken = async (): Promise<string> => {
  const url = `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
  console.log(url);
  const response = await axios.post(url, null, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log(response.data);
  return response.data.access_token;
}

export const getPlaylist = async (playlistId: string) => {
  const accessToken = await getAccessToken();
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const getUser = async () => {
  const accessToken = await getUserAccessToken();
  const url = `https://api.spotify.com/v1/me`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const getUserPlaybackState = async () => {
  const accessToken = await getUserAccessToken();
  const url = `https://api.spotify.com/v1/me/player`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const getUserQueue = async () => {
  const accessToken = await getUserAccessToken();
  const url = `https://api.spotify.com/v1/me/player/queue`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const getUserCurrentlyPlaying = async () => {
  const accessToken = await getUserAccessToken();
  const url = `https://api.spotify.com/v1/me/player/currently-playing`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const skipToNextTrack = async () => {
  const accessToken = await getUserAccessToken();
  const url = `https://api.spotify.com/v1/me/player/next`;
  const response = await axios.post(url, null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const getTopItems = async (type: 'artists' | 'tracks', time_range: 'short_term' | 'medium_term' | 'long_term', limit: number = 20) => {
  const accessToken = await getUserAccessToken();
  const url = `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${limit}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
