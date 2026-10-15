export interface UploadImageItemDTO {
    title: string;
    file: Buffer;
    mimeType: string;
}

export interface UploadImageInputDTO {
    userId: string;
    images: UploadImageItemDTO[];
}

export interface UploadImageOutputDTO {
    id: string;
    title: string;
    order: number;
    secureUrl: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BulkUploadImageRequestBody {
    titles: string[];
}
