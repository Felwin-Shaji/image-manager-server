export interface ImageProps {
    id: string | null;
    ownerId: string;
    title: string;
    publicId: string;
    secureUrl: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Image {
    public readonly id: string | null;
    public readonly ownerId: string;
    public title: string;
    public readonly publicId: string;
    public readonly secureUrl: string;
    public readonly format: string;
    public readonly bytes: number;
    public readonly width: number;
    public readonly height: number;
    public order: number;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    constructor(props: ImageProps) {
        this.id = props.id;
        this.ownerId = props.ownerId;
        this.title = props.title;
        this.publicId = props.publicId;
        this.secureUrl = props.secureUrl;
        this.format = props.format;
        this.bytes = props.bytes;
        this.width = props.width;
        this.height = props.height;
        this.order = props.order;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}