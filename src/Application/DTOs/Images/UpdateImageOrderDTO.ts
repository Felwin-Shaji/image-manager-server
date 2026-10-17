export interface UpdateImageOrderItemDTO {
    imageId: string;
    order: number;
}

export interface UpdateImageOrderInputDTO {
    ownerId: string;
    imageOrders: UpdateImageOrderItemDTO[];
}