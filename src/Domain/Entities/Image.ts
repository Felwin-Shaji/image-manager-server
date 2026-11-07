export class Image {
    constructor(
        public readonly id: string | null,
        public readonly ownerId: string,
        public readonly title: string,
        public readonly publicId: string,
        public readonly secureUrl: string,
        public readonly format: string,
        public readonly bytes: number,
        public readonly width: number,
        public readonly height: number,
        public readonly order: number,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}