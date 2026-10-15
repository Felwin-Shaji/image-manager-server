import bcrypt from "bcrypt";
import { IPasswordService } from "../../Application/Interfaces/Services/IPasswordService";

export class BcryptPasswordService implements IPasswordService {
    private readonly saltRounds = 12;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}