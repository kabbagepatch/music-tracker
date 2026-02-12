export interface Vinyl {
  id: string,
  discogsId?: string,
  userId: string,
  album: string,
  artist: string,
  nSides: number,
  discColor: string,
  favorite: boolean,
  genres: string[],
  tracks: string[],
  imageUrl: string,
  albumImageUrl: string,
  vinylImageUrl: string,
  published: string,
};

export interface VinylPlay {
  userId: string,
  playId: string,
  vinylId: string,
  sides: number[],
  album: string,
  artist: string,
  nSides: number,
  imageUrl: string,
};

export interface DiscogsVinyl {
  discogsId: string,
  title: string,
  published: string,
  genres: string[],
  thumbnailUrl: string,
  imageUrl: string,
  discColor: string,
  barcode: string,
}
