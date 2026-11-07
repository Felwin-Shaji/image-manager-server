import { User } from "../../../Domain/Entities/User";
import { IUserRepository } from "../../Interfaces/Repositories/IUserRepository";
import { IPasswordService } from "../../Interfaces/Services/IPasswordService";
import { IRegisterUserUseCase } from "../../Interfaces/UseCases/IRegisterUserUseCase";
import { RegisterUserInputDTO, RegisterUserOutputDTO } from "../../DTOs/Auth/RegisterUserDTO";
import { AppError } from "../../Errors/AppError";
import { STATUS_CODE } from "../../Constants/HttpStatusCode";
import { USER_MESSAGES } from "../../Constants/Messages/UserMessages";

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
            throw new AppError(USER_MESSAGES.EMAIL_ALREADY_REGISTERED, STATUS_CODE.CONFLICT);
        }

        const hashedPassword = await this.passwordService.hash(input.password);

        const user = new User(
            null,
            email,
            phone,
            hashedPassword
        );

        const createdUser = await this.userRepository.create(user);

        if (!createdUser.id) {
            throw new AppError(USER_MESSAGES.USER_CREATION_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
        }

        return {
            id: createdUser.id,
            email: createdUser.email,
            phone: createdUser.phone
        };
    }
}
