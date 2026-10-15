export interface UserProps {
    id: string | null;
    email: string;
    phone: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User {
    public readonly id: string | null;
    public readonly email: string;
    public readonly phone: string;
    public readonly password: string;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.phone = props.phone;
        this.password = props.password;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}