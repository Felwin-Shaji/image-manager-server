
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per image

export const MAX_IMAGE_COUNT = 10;

export const MAX_IMAGE_TITLE_LENGTH = 120;

export const ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
] as const;

export type AllowedImageMimeType =
    (typeof ALLOWED_IMAGE_MIME_TYPES)[number];
