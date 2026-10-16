
export interface RefreshTokenOutputDTO {
    accessToken: string;
    user: {
        id: string;
        email: string;
        phone: string;
    };
}
