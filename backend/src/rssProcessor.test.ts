process.env.API_KEY = 'test-key';

import { getAndProcessReleaseNotes } from './rssProcessor';
import * as productService from './productService';

jest.mock('./productService');

describe('getAndProcessReleaseNotes', () => {
  it('should process the RSS feed', async () => {
    (productService.getProductFeeds as jest.Mock).mockResolvedValue([]);
    const feed = await getAndProcessReleaseNotes();
    expect(feed).toBeDefined();
  });
});
