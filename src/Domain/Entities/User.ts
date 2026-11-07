export class User {
    constructor(
        public readonly id: string | null,
        public readonly email: string,
        public readonly phone: string,
        public readonly password: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}