import { serve } from "./deps.ts";
import { PGClient } from "./deps.ts";

const dbConfig = {
  applicationName: "learn-docker",
  hostname: Deno.env.get("POSTGRES_HOST"),
  database: Deno.env.get("POSTGRES_DB"),
  user: Deno.env.get("POSTGRES_USER"),
  password: Deno.env.get("POSTGRES_PASSWORD"),
  port: 5432,
}
const db = new PGClient(dbConfig);  

try {
  await db.connect();
} catch (error) {
  console.error(error)
}

const port = 80;

const handler = async (request: Request): Promise<Response> => {
  console.info(request.url)
  const path = request.url.replace('http://localhost', '')
  
  if (path.startsWith('/api/health')) {
    const json = {status: 'OK'}
    return new Response(JSON.stringify(json), { status: 200, headers: {'content-type': 'application/json' }});
  }

  const result = await db.queryArray("SELECT NOW()");

  const obj = {
    msg: "Hello World",
    now: result.rows[0]
  }
  return new Response(JSON.stringify(obj), { status: 200, headers: {'content-type': 'application/json' }});
};

console.log(`HTTP webserver running. Access it at: http://localhost:80/`);
await serve(handler, { port });