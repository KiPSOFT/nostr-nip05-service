export interface User {
    _id?: any, 
    name: string;
    email?: string;
    publicKey: string;
    verified: boolean;
    createdAt: Date;
    verifiedAt?: Date;
}