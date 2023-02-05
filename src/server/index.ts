import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { DB } from "./lib/db.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import NostrCheck from "./lib/nostr.ts";

await load({
  export: true,
  allowEmptyValues: true,
});

const db = new DB();
await db.connect();

const nostr = new NostrCheck(db);
await nostr.connect();

const app = new Application();

const port = parseInt(Deno.env.get('PORT') || '9080');

const router = new Router();

router.get("/.well-known/nostr.json", async({request, response }: { request: any, response: any }) => {
  const name = request.url.searchParams.get('name');
  const users = await db.getVerifiedUsers(name);
  const temp: any = {};
  for (const usr of users) {
    temp[usr.name] = nostr.getKeyFromNip19(usr.publicKey);
  }
  response.status = 200;
  response.body = {
    names: temp
  };
});

router.post('/api/register', async ({request, response}) => {
    const data = await request.body().value;
    if (!await db.findUser(data.publicKey)) {
      try {
        if (data.name.length < 4) {
          throw new Error('You can choose a name with at least 4 characters.');
        }
        await db.registerUser({
          createdAt: new Date(),
          email: data.email,
          name: data.name,
          publicKey: data.publicKey,
          verified: false
        });
        response.status = 200;
        response.body = {
          message: 'Success'
        };
      } catch (err: any) {
        response.status = 500;
        response.body = {
          message: err.message
        };
      }
    } else {
      response.status = 400;
      response.body = {
        message: 'This public key already exists.'
      }
    }
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log('running on port ', port);
await app.listen({ port });