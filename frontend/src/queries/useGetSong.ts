import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getApiUrl } from '../sanityIntegration';

export const SONG_SINGLETON_ID = 'song';

export type SongType = {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string | null;
};

const query = `
  *[_type == "song" && _id == ${JSON.stringify(SONG_SINGLETON_ID)}][0]{
    _id,
    title,
    artist,
    "audioUrl": audio.asset->url
  }
`;

export const getSong = async (): Promise<{
  result: SongType | null;
}> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetSong = () => {
  return useQuery({
    queryKey: ['song'],
    queryFn: getSong,
    select: (res) => res.result,
  });
};
