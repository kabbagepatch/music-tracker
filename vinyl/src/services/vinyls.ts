import axios from 'axios';
import type { DiscogsVinyl, Vinyl, VinylPlay } from '../types';
import { getAuth } from 'firebase/auth';
import { setupCache, type CacheAxiosResponse, type CachedStorageValue } from 'axios-cache-interceptor';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
service.interceptors.request.use(async (config) => {
  const token = await getAuth().currentUser?.getIdToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
setupCache(service);

export const getVinyls = async () : Promise<Vinyl[]> => {
  try {
    // @ts-ignore
    const response = await service.get('/vinyls', { id: 'list-vinyls' });
    const data = response.data;
    data.sort((a: any, b: any) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      if (a.artist.toLowerCase() > b.artist.toLowerCase()) return 1
      if (a.artist.toLowerCase() < b.artist.toLowerCase()) return -1
      if (a.published > b.published) return 1

      return -1
    });
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const createVinyl = async (discogsId: string | undefined) => {
  return service.post('/vinyls', { discogsId }, {
    // @ts-ignore
    cache: {
      update: {
        'list-vinyls': (listVinylsCache: CachedStorageValue,vinylResponse: CacheAxiosResponse) => {
          if (listVinylsCache.state !== 'cached') return 'ignore';
          listVinylsCache.data.data = [vinylResponse.data].concat(listVinylsCache.data.data);

          return listVinylsCache;
        }
      }
    }
  });
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
    // @ts-ignore
    const response = await service.get('/vinyls/history', { id: 'list-vinyl-plays' });
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export const playVinyl = async (id: string, data: { sides: number[] }) => {
  await service.post(`/vinyls/${id}/plays`, data, {
    // @ts-ignore
    cache: {
      update: {
        'list-vinyl-plays': (listPlaysCache: CachedStorageValue, playResponse: CacheAxiosResponse) => {
          if (listPlaysCache.state !== 'cached') return 'ignore';
          listPlaysCache.data.data = [playResponse.data].concat(listPlaysCache.data.data);

          return listPlaysCache;
        }
      }
    }
  });
}
