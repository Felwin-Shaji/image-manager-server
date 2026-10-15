export interface ImageStorageResult {
    publicId: string;
    secureUrl: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
}

export interface IImageStorageService {
    upload(file: Buffer, folder?: string): Promise<ImageStorageResult>;

    delete(publicId: string): Promise<void>;
}