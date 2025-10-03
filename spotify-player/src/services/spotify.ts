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
  const accessToken = "BQDqpYrmcy7sJ_gcN0ZXvaVC1fp2Sa3Z4gJ2y7tAJL9C-TgT8rTmwhKafj-WCw3w-vd3z6NBFLjj7mLh1HU3XN3NJprem8ag7tOHb7cjXfbahSRfTcpT4Yk41xJJUv1uhQX60UrqEPM" // await getAccessToken();
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
