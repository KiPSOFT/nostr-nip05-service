import { User } from '../interfaces/user.ts';
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export class DB {
    public db: any;

    async connect() {
        const mongoDBUri = `mongodb+srv://${Deno.env.get('MONGODB_USER')}:${Deno.env.get('MONGODB_PASSWORD')}@${Deno.env.get('MONGODB_HOST')}/nip05?authMechanism=SCRAM-SHA-1`;
        console.log(`DB Connecting to; ${mongoDBUri} `);
        const client = new MongoClient();
        await client.connect(mongoDBUri);
        this.db = client.database('nip05');
    }

    async registerUser(user: User) {
        return await this.db.collection('users').insertOne(user);
    }

    async findUser(publicKey: string) {
        return await this.db.collection('users').findOne({ publicKey });
    }

    async getVerifiedUsers(): Promise<Array<User>> {
        return await this.db.collection('users').find({
            verified: true
        });
    }

}