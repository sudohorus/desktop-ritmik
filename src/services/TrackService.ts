import { TrackResponse } from '../types/track';

export class TrackService {
  static async getTrending(pageToken?: string): Promise<TrackResponse> {
    try {
      // @ts-ignore
      const res = await window.ipcRenderer.invoke('youtube-get-trending', { pageToken });
      return res;
    } catch (error) {
      console.error('IPC Renderer Error fetching tracks:', error);
      throw error;
    }
  }
}
