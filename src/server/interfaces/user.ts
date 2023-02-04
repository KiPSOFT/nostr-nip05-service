export interface User {
    name: string;
    email?: string;
    publicKey: string;
    verified: boolean;
    createdAt: Date;
    verifiedAt?: Date;
}