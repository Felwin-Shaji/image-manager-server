import { User } from "../../../Domain/Entities/User";
import { IUserRepository } from "../../Interfaces/Repositories/IUserRepository";
import { IPasswordService } from "../../Interfaces/Services/IPasswordService";
import { IRegisterUserUseCase } from "../../Interfaces/UseCases/IRegisterUserUseCase";
import { RegisterUserInputDTO, RegisterUserOutputDTO } from "../../DTOs/Auth/RegisterUserDTO";
import { AppError } from "../../Errors/AppError";

export class RegisterUserUseCase implements IRegisterUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordService: IPasswordService
    ) { }

    async execute(input: RegisterUserInputDTO): Promise<RegisterUserOutputDTO> {
        const email = input.email.trim().toLowerCase();
        const phone = input.phone.trim();

        const existingUser = await this.userRepository.existsByEmail(email);

        if (existingUser) {
            throw new AppError("Email is already registered", 409);
        }

        const hashedPassword = await this.passwordService.hash(input.password);

        const user = new User({
            id: null,
            email,
            phone,
            password: hashedPassword
        });

        const createdUser = await this.userRepository.create(user);

        if (!createdUser.id) {
            throw new AppError("Failed to create user");
        }

        return {
            id: createdUser.id,
            email: createdUser.email,
            phone: createdUser.phone
        };
    }
}
