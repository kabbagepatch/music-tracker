import axios from "axios";

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
