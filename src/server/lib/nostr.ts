import { Nostr } from 'https://deno.land/x/nostr_deno_client@v0.2.7/mod.ts';
import { User } from '../interfaces/user.ts';
import { DB } from './db.ts';

export default class NostrCheck extends Nostr {
    private intervalId: number = 0;
    private db: DB;

    constructor(_db: DB) {
        super();
        this.db = _db;
        this.privateKey = Deno.env.get('PRIVATE_KEY');
        this.relayList.push({
            name: 'Nostrprotocol',
            url: 'wss://relay.damus.io'
        } as never);
        this.relayList.push({
            name: 'Nostrprotocol',
            url: 'wss://relay.snort.social'
        } as never);
        this.on('relayConnected', this.eventRelayConnected.bind(this), null);
        this.on('relayError', (err: any) => console.log('Relay error;', err), null);
    }

    eventRelayConnected() {
        console.log('Relay connected - wss://relay.nostrprotocol.net');
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
        clearInterval(this.intervalId);
        const since = this.getHoursAgo(48);
        console.log('Checking users...', Date.now(), since);
        const filter = { kinds: [1], since, '#p': [Deno.env.get('PUBLIC_KEY')] };
        const events = await this.filter(filter).collect();
        console.log('Events ...', events);
        for (const evnt of events) {
            const usr = await this.db.checkUser(evnt.pubkey);
            if (usr && evnt.content === 'Please approve my NIP-05 request on https://nip05.nostprotocol.net #[0]') {
                await this.verifyUser(evnt.pubkey, usr);
                console.log(`${usr.name} request is approved.`);
            }
        }
        console.log('Receiving messages sent with "nostr" clients that do not support mention feature...')
        const _users = await this.db.getNonVerifiedUsers();
        for (const usr of _users) {
            const _filter = { kinds: [1], since, authors: [ usr.publicKey ] };
            console.log(`User checking... ${usr.publicKey}`);
            const _events = await this.filter(_filter).collect();
            for (const _evnt of _events) {
                const text = `Please approve my NIP-05 request on https://nip05.nostprotocol.net @${Deno.env.get('NPUBLIC_KEY')}`;
                if (_evnt.content === text) {
                    await this.verifyUser(_evnt.pubkey, usr);
                    console.log(`${usr.name} request is approved.`);
                }
            }
        }
        console.log('Receiving messages is finished.');
        this.intervalId = setInterval(this.checkUsers.bind(this), 1000 * 60 * 15);
    }

}