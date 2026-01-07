import { beforeEach, describe, expect, it, vi } from 'vitest';
import { uploadMediaFile } from '../utils/upload';

describe('uploadMediaFile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses MediaApi when available and succeeds', async () => {
    const fakeMediaApi: any = {
      mediaUploadPost: vi.fn().mockResolvedValue({ data: { ok: true } }),
    };

    const file = { uri: 'file://test.pdf', name: 'test.pdf' } as any;

    await uploadMediaFile(file, 'store-1', 'document', { mediaApi: fakeMediaApi });

    expect(fakeMediaApi.mediaUploadPost).toHaveBeenCalled();
  });

  it('falls back to fetch on transport error', async () => {
    const fakeMediaApi: any = {
      mediaUploadPost: vi.fn().mockRejectedValue(new Error('Network Error')),
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'uploaded-1' }),
    });

    (globalThis as any).fetch = mockFetch;

    const file = { uri: 'file://test2.pdf', name: 'test2.pdf' } as any;

    const res = await uploadMediaFile(file, 'store-1', 'document', { mediaApi: fakeMediaApi });

    expect(mockFetch).toHaveBeenCalled();
    expect(res).toEqual({ id: 'uploaded-1' });
  });
});
