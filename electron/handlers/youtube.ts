import { ipcMain } from 'electron';

export function registerYoutubeHandlers() {
  ipcMain.handle('youtube-get-trending', async (_event, args) => {
    try {
      const youtubesearchapi = (await import('youtube-search-api')).default;
      
      const pageTokenStr = args?.pageToken;
      let result;

      if (pageTokenStr) {
        const pageToken = JSON.parse(pageTokenStr);
        result = await youtubesearchapi.NextPage(pageToken, false, 20);
      } else {
        result = await youtubesearchapi.GetListByKeyword('music', false, 20, [{ type: 'video' }]);
      }
      const items = result.items || [];
      const filteredItems = items.filter((item: any) => item.type === 'video' && item.length);

      const parseDuration = (duration: string): number => {
        if (!duration) return 0;
        const parts = duration.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return parts[0] || 0;
      };

      const tracks = filteredItems.map((item: any) => ({
        id: item.id,
        videoId: item.id,
        title: item.title || '',
        artist: item.channelTitle || 'Unknown',
        channel: item.channelTitle || 'Unknown',
        duration: item.length?.simpleText ? parseDuration(item.length.simpleText) : 0,
        viewCount: 0,
        thumbnail: item.thumbnail?.thumbnails?.[0]?.url || ''
      }));

      const nextPageData = result.nextPage ? JSON.stringify(result.nextPage) : null;

      return {
        data: tracks,
        hasMore: !!nextPageData,
        nextPageData: nextPageData
      };

    } catch (error) {
      console.error('Internal API Handler Error:', error);
      throw error;
    }
  });
}
