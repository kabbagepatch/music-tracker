import axios from 'axios';
import type { DiscogsVinyl, Vinyl, VinylPlay } from '../types';
import { getAuth } from 'firebase/auth';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
service.interceptors.request.use(async (config) => {
  const token = await getAuth().currentUser?.getIdToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
})

export const getVinyls = async () : Promise<Vinyl[]> => {
  try {
    const response = await service.get('/vinyls');
    const data = response.data;
    data.sort((a: any, b: any) => a.artist.toLowerCase() > b.artist.toLowerCase() ? 1 : -1);
    data.sort((a: any, b: any) => a.favorite && !b.favorite ? -1 : 1);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const createVinyl = async (discogsId: string | undefined) => {
  return service.post('/vinyls', { discogsId });
}

export const getVinyl = async (id: string): Promise<Vinyl> => {
  const response = await service.get(`/vinyls/${id}`);
  return response.data;
}

export const updateVinyl = async (id: string, data: Vinyl): Promise<Vinyl> => {
  const response = await service.put(`/vinyls/${id}`, data);
  return response.data;
}

export const deleteVinyl = async (id: string) => {
  return service.delete(`/vinyls/${id}`);
}

export const searchVinyls = async (term: string) : Promise<DiscogsVinyl[]> => {
  try {
    const response = await service.get(`music/discogs/search?album=${term}`);
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export const getDiscogsVinyl = async (discogsId: string) : Promise<Vinyl | undefined> => {
  try {
    const response = await service.get(`music/discogs/${discogsId}`);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export const getPlayHistory = async () : Promise<VinylPlay[]> => {
  try {
    const response = await service.get('/vinyls/history');
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}
