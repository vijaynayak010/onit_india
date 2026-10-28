import axios from "axios";
import { getPresignedUrl } from "../components/Performer/services/api";

/**
 * Upload a file via presigned URL (S3). Returns public URL when available.
 */
export async function uploadFileViaPresignedUrl(file, { folder = "uploads" } = {}) {
  const fileName = file.name || "file";
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop().toLowerCase() : "png";

  const res = await getPresignedUrl({
    filename: fileName,
    extension,
    contentType: file.type || "application/octet-stream",
    folder,
  });

  const payload = res?.data || res;
  const uploadUrl = payload.uploadUrl || payload.url;
  const s3Key = payload.s3Key || payload.key;
  const publicUrl = payload.publicUrl;

  if (!uploadUrl) {
    throw new Error("Could not generate upload URL.");
  }

  const cleanAxios = axios.create();
  await cleanAxios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });

  if (publicUrl) return publicUrl;
  if (s3Key) {
    return `https://onit-india-app-uploads.s3.ap-south-1.amazonaws.com/${s3Key}`;
  }
  return s3Key || uploadUrl;
}

/** Normalize paginated API lists (page + limit). */
export function normalizePagedList(response, keys = ["data", "items", "tasks", "taskers"]) {
  if (!response) return { items: [], page: 1, limit: 10, total: 0 };
  if (Array.isArray(response)) {
    return { items: response, page: 1, limit: response.length, total: response.length };
  }
  for (const key of keys) {
    if (Array.isArray(response[key])) {
      return {
        items: response[key],
        page: response.page ?? response.pagination?.page ?? 1,
        limit: response.limit ?? response.pagination?.limit ?? response[key].length,
        total: response.total ?? response.pagination?.total ?? response[key].length,
      };
    }
  }
  return { items: [], page: 1, limit: 10, total: 0 };
}
