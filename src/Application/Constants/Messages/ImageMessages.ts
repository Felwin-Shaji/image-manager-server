export const IMAGE_MESSAGES = {
    IMAGE_ID_REQUIRED: "Image ID is required",
    VALID_IMAGE_ID_REQUIRED: "Valid image ID is required",
    IMAGE_NOT_FOUND: "Image not found",
    IMAGE_TITLE_REQUIRED: "Image title is required",
    IMAGE_TITLE_TOO_LONG: (maxLength: number) =>
        `Image title must not exceed ${maxLength} characters`,
    IMAGE_FILE_REQUIRED: "Image file is required",
    IMAGE_FILE_INVALID: "Invalid image file",
    IMAGE_FILE_EMPTY_OR_INVALID: "Invalid or empty image file",
    UNSUPPORTED_IMAGE_TYPE: "Unsupported image type",
    IMAGE_SIZE_EXCEEDED: (maxSizeMb: number) =>
        `Image exceeds the ${maxSizeMb} MB size limit`,
    AN_IMAGE_SIZE_EXCEEDED: (maxSizeMb: number) =>
        `An image exceeds the ${maxSizeMb} MB size limit`,
    IMAGE_SIZE_LIMIT: (maxSizeMb: number) =>
        `Image must not exceed ${maxSizeMb} MB`,
    IMAGE_COUNT_RANGE: (maxCount: number) =>
        `Upload between 1 and ${maxCount} images`,
    MAXIMUM_IMAGES_PER_REQUEST: (maxCount: number) =>
        `Maximum ${maxCount} images are allowed per request`,
    UPLOAD_ONE_REPLACEMENT_IMAGE: 'Upload one replacement image using the "image" field',
    REPLACEMENT_IMAGE_REQUIRED: "Replacement image is required",
    REPLACEMENT_IMAGE_FIELD_REQUIRED: 'A replacement image is required in the "image" field',
    AT_LEAST_ONE_IMAGE_REQUIRED: "At least one image is required",
    TITLES_JSON_ARRAY_REQUIRED: "Titles must be provided as a JSON array",
    INVALID_TITLES_JSON: "Invalid titles JSON format",
    TITLES_MUST_BE_STRINGS: "Titles must be an array of strings",
    TITLE_FOR_EACH_IMAGE_REQUIRED: "Each image must have exactly one title",
    IMAGE_TITLES_CANNOT_BE_EMPTY: "Image titles cannot be empty",
    IMAGE_TITLES_TOO_LONG: (maxLength: number) =>
        `Image titles must not exceed ${maxLength} characters`,
    INVALID_MULTIPART_UPLOAD: "Invalid multipart image upload",
    INVALID_IMAGE_UPLOAD_REQUEST: "Invalid image upload request",
    VALID_IMAGE_IDS_REQUIRED: "A valid list of image IDs is required",
    DUPLICATE_IMAGE_IDS: "Duplicate image IDs are not allowed",
    IMAGE_ORDER_REQUIRED: "Image order must not be empty",
    IMAGE_IDS_MUST_BE_VALID_AND_UNIQUE: "Image IDs must be valid and unique",
    IMAGE_POSITIONS_MUST_BE_UNIQUE: "Image positions must be unique non-negative integers",
    ORDER_MUST_INCLUDE_ALL_IMAGES: "The submitted order must contain all your images",
    INVALID_IMAGE_RECORD: "Invalid image record",
    UNABLE_TO_SAVE_IMAGE_METADATA: "Unable to save image metadata",
    UNABLE_TO_RETRIEVE_UPDATED_IMAGE: "Unable to retrieve updated image",
    UNABLE_TO_RETRIEVE_REPLACED_IMAGE: "Unable to retrieve the updated image",
    FAILED_TO_UPLOAD_IMAGE: "Failed to upload image",
    FAILED_TO_DELETE_IMAGE: "Failed to delete image",
    UNAUTHORIZED_IMAGE_ACCESS: "Unauthorized access to image",
    INVALID_IMAGE_TITLE: "Image title cannot be empty",

    IMAGE_UPLOAD_SUCCESS: "Image uploaded successfully",
    IMAGES_UPLOAD_SUCCESS: "Images uploaded successfully",
    IMAGE_UPDATE_SUCCESS: "Image updated successfully",
    IMAGE_TITLE_UPDATE_SUCCESS: "Image title updated successfully",
    IMAGE_REPLACE_SUCCESS: "Image replaced successfully",
    IMAGE_DELETE_SUCCESS: "Image deleted successfully",
    IMAGES_RETRIEVED_SUCCESS: "Images retrieved successfully",
    IMAGE_REORDER_SUCCESS: "Images reordered successfully",
    IMAGE_ORDER_UPDATE_SUCCESS: "Image order updated successfully"
} as const;
