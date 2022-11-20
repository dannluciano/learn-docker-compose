import { serve } from "./deps.ts";
import { PGClient } from "./deps.ts";
import { PrometheusCounter, PrometheusRegistry } from "./deps.ts";

const counter = PrometheusCounter.with({
  name: "http_requests_total",
  help: "The total HTTP requests",
  labels: ["path", "method", "status"],
});

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
  console.info("Database Connected!")
} catch (error) {
  console.error(error)
}

const port = 80;

const handler = async (request: Request): Promise<Response> => {
  console.info(request.url)
  const url = new URL(request.url);
  const path = url.pathname
  const method = request.method
  
  if (path.startsWith('/api/health')) {
    const json = {status: 'OK'}
    return new Response(JSON.stringify(json), { status: 200, headers: {'content-type': 'application/json' }});
  }

  if (method === 'GET' && path.startsWith('/api/metrics')) {
    const body = PrometheusRegistry.default.metrics();
    return new Response(body, { status: 200, headers: {'content-type': '' }});
  }

  const result = await db.queryArray("SELECT NOW()");

  const obj = {
    msg: "Hello World",
    now: result.rows[0]
  }
  const status = 200
  counter.labels({
    path,
    method,
    status
  }).inc();
  console.info(path, method, status)
  return new Response(
    JSON.stringify(obj), { status, headers: {'content-type': 'application/json' }}
  );
};

console.log(`HTTP webserver running. Access it at: http://localhost:80/`);
await serve(handler, { port });