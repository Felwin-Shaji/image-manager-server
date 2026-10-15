export interface LoginUserInputDTO {
    email: string;
    password: string;
}

export interface LoginUserOutputDTO {
    id: string;
    email: string;
    phone: string;
    accessToken: string;
    refreshToken: string;
}
