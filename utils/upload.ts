import { STORAGE_KEYS } from "@/constants";
import { getStorageItem } from "@/utils/storage";
import { Platform } from 'react-native';
import { apiConfig } from "../api/config";
import { MediaApi, MediaUploadPostReferenceTypeEnum } from "../api/endpoints/media-api";

export interface UploadOptions {
  onUploadProgress?: (loaded?: number, total?: number) => void;
  mediaApi?: MediaApi;
  identifier?: string;
}

/**
 * Uploads a single file using the generated MediaApi, with robust RN-safe fallbacks.
 * - Tries the API client first (axios)
 * - On network/transport errors, falls back to fetch-based multipart upload
 */
export async function uploadMediaFile(
  file: any,
  referenceId: string,
  referenceType: string = "document",
  opts: UploadOptions = {}
) {
  const mediaApi = opts.mediaApi ?? new MediaApi(apiConfig);
  const identifier = opts.identifier;

  // Helper to detect transport/network error
  const isTransportError = (err: any) => {
    const msg = String(err?.message || "").toLowerCase();
    return msg.includes("network error") || !err?.response;
  };

  // If running on native (iOS/Android), prefer the fetch-based multipart strategy first
  const preferFetchFirst = Platform.OS !== 'web';

  const appendFileToForm = async (formData: FormData) => {
    // Web File
    if (typeof File !== 'undefined' && file instanceof File) {
      formData.append('file', file, (file as File).name);
      return;
    }

    // Try blob conversion from data URL base64 if we received base64 value
    try {
      let uri = file.uri;
      if (uri && typeof uri === 'string') {
        // If the runtime supports fetch(blob) conversion, try to get a blob
        try {
          // If file has base64 or a data URL we can convert; otherwise try fetch(uri) which may work on RN with file://
          if ((file as any).base64) {
            const dataUrl = `data:${file.mimeType || file.type || 'application/octet-stream'};base64,${(file as any).base64}`;
            const blob = await (await fetch(dataUrl)).blob();
            const name = file.name || file.fileName || uri.split('/').pop() || 'file';
            formData.append('file', blob as any, name);
            return;
          }

          // On Native, skip blob conversion for URIs and use the RN object format
          if (Platform.OS !== 'web') {
             throw new Error('Skip blob conversion on native');
          }

          // Try fetch on the uri and convert to blob (works in many RN setups)
          const blob = await (await fetch(uri)).blob();
          const name = file.name || file.fileName || uri.split('/').pop() || 'file';
          formData.append('file', blob as any, name);
          return;
        } catch (errBlob) {
          // If blob conversion fails, fall through to RN-style append
          console.warn('Blob conversion failed in uploader util', errBlob);
        }

        // RN-style append with { uri, name, type }
        const name = file.name || file.fileName || uri.split('/').pop() || 'file';
        formData.append('file', {
          uri,
          name,
          type: file.type || file.mimeType || 'application/octet-stream',
        } as any);
        return;
      }

      // As a last resort, try attaching the file object directly (may work in some runtimes)
      formData.append('file', file as any);
    } catch (e) {
      console.error('Failed to append file in uploader util', e);
      throw e;
    }
  };

  const doFetchUpload = async () => {
    const formData = new FormData();
    await appendFileToForm(formData);
    formData.append('referenceId', String(referenceId));
    formData.append('referenceType', referenceType);
    if (identifier) {
      formData.append('identifier', identifier);
    }

    const token = (apiConfig?.accessToken && typeof apiConfig.accessToken === 'function') ? await apiConfig.accessToken() : await getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);

    const res = await fetch(`${apiConfig.basePath}/media/upload`, {
      method: 'POST',
      body: formData as any,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      } as any,
    });

    const resBody = await res.json().catch(() => null);

    if (!res.ok) {
      const err = new Error(`Fallback upload failed: ${res.status} ${JSON.stringify(resBody)}`);
      (err as any).response = resBody;
      throw err;
    }

    return resBody;
  };

  if (preferFetchFirst) {
    try {
      return await doFetchUpload();
    } catch (fetchErr) {
      console.warn('Fetch-based upload failed on native, falling back to axios', fetchErr);
      // fallthrough to axios route below
    }
  }

  try {
    // Prefer API client (supports onUploadProgress for axios)
    await mediaApi.mediaUploadPost(
      file,
      referenceId,
      referenceType as MediaUploadPostReferenceTypeEnum,
      identifier as any,
      {
        onUploadProgress: (ev: any) => {
          if (opts.onUploadProgress && ev) {
            opts.onUploadProgress((ev as any)?.loaded, (ev as any)?.total);
          }
        },
      }
    );
    return;
  } catch (err: any) {
    // Only attempt fallback on transport errors
    if (!isTransportError(err)) {
      // When we get a 4xx/400 response, surface it with additional debug info
      console.error('axios upload error', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
      throw err;
    }

    // try the fetch fallback as a last resort
    return await doFetchUpload();
  }
}
