export interface UpdateImageTitleRequestBody {
    title: string;
}

export interface UpdateImageTitleInputDTO {
    imageId: string;
    ownerId: string;
    title: string;
}

export interface ReplaceImageInputDTO {
    imageId: string;
    ownerId: string;
    file: Buffer;
    mimeType: string;
}