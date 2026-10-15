import { container } from "tsyringe";
import { MongoUserRepository } from "../Database/Repositories/MongoUserRepository";
import { MongoImageRepository } from "../Database/Repositories/MongoImageRepository";
import { REPOSITORY_TOKENS } from "./Tokens/RepositoryTokens";

export class RepositoryRegistry {
    static register(): void {

        container.register(
            REPOSITORY_TOKENS.IUserRepository,
            { useClass: MongoUserRepository }
        );

        container.register(
            REPOSITORY_TOKENS.IImageRepository,
            { useClass: MongoImageRepository }
        );
    }
}
