import { User } from "../../../Domain/Entities/User";
import { IUserRepository } from "../../../Application/Interfaces/Repositories/IUserRepository";
import { UserModel } from "../Models/UserModel";

export class MongoUserRepository implements IUserRepository {

    async create(user: User): Promise<User> {
        const createdUser = await UserModel.create({
            email: user.email,
            phone: user.phone,
            password: user.password
        });

        return this.toDomain(createdUser, user.password);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email })
            .select("+password")
            .exec();

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id).exec();

        if (!user) {
            return null;
        }

        return this.toDomain(user);
    }

    async existsByEmail(email: string): Promise<boolean> {
        const user = await UserModel.exists({ email }).exec();

        return user !== null;
    }

    private toDomain(
        document: InstanceType<typeof UserModel>,
        passwordOverride?: string
    ): User {
        return new User({
            id: document._id.toString(),
            email: document.email,
            phone: document.phone,
            password: passwordOverride ?? document.password ?? "",
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        });
    }
}