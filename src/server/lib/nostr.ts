import { Nostr } from 'https://deno.land/x/nostr_deno_client@v0.2.7/mod.ts';
import { User } from '../interfaces/user.ts';
import { DB } from './db.ts';

export default class NostrCheck extends Nostr {
    private intervalId: number = 0;
    private db: DB;

    constructor(_db: DB) {
        super();
        this.db = _db;
        const server = {
            name: 'Nostrprotocol',
            url: 'wss://relay.damus.io'
        }
        this.privateKey = Deno.env.get('PRIVATE_KEY');
        this.relayList.push(server as never);
        this.on('relayConnected', this.eventRelayConnected.bind(this), null);
        this.on('relayError', (err: Error) => console.log('Relay error;', err), null);
    }

    eventRelayConnected() {
        console.log('Relay connected');
        this.intervalId = setInterval(this.checkUsers.bind(this), 1000);
    }

    private getHoursAgo(hours: number): number {
        return Math.floor(Date.now() / 1000) - (hours * 60 * 60);
    }

    private async verifyUser(publicKey: string, usr: User) {
        usr.verified = true;
        usr.verifiedAt = new Date();
        await this.db.updateUser(usr);
        await this.sendMessage(publicKey, `🍺 Congratulations. Your NIP-05 registration request for nostrprotocol.net has been approved. 
        You can now enter the information ${usr.name}@nostrprotocol.net from your nostr client's profile settings 
        into the NIP-05 field and start using it. `);
    }

    async checkUsers() {
        console.log('Checking users...', Date.now());
        clearInterval(this.intervalId);
        const since = this.getHoursAgo(1);
        const filter = { kinds: [1], since, '#p': [Deno.env.get('PUBLIC_KEY')] };
        const events = await this.filter(filter).collect();
        for (const evnt of events) {
            const key = this.getNip19FromKey(evnt.pubkey);
            const usr = await this.db.checkUser(key);
            if (usr && evnt.content === 'Please approve my NIP-05 request on nostprotocol.net #[0]') {
                await this.verifyUser(evnt.pubkey, usr);
                console.log(`${usr.name} request is approved.`);
            }
        }
        this.intervalId = setInterval(this.checkUsers.bind(this), 1000 * 60 * 15);
    }

}