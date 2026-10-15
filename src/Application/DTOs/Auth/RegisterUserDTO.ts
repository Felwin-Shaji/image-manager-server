export interface RegisterUserInputDTO {
    email: string;
    phone: string;
    password: string;
}

export interface RegisterUserOutputDTO {
    id: string;
    email: string;
    phone: string;
}
