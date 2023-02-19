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

    async getVerifiedUsers(name: string): Promise<Array<User>> {
        let search: any = {
            verified: true
        };
        if (name) {
            search.name = name;
        }
        return await this.db.collection('users').find(search).toArray();
    }

    async getNonVerifiedUsers(): Promise<Array<User>> {
        let search: any = {
            verified: false
        };
        return await this.db.collection('users').find(search).toArray();
    }

    async checkUser(publicKey: string): Promise<User|null> {
        return await this.db.collection('users').findOne({
            publicKey,
            verified: false
        });
    }

    async updateUser(usr: User) {
        return await this.db.collection('users').updateOne({
            _id: usr._id
        }, { $set: usr });
    }

}