import { serve } from "./deps.ts";

const port = 80;

const handler = (request: Request): Response => {
  console.info(request.url)
  const path = request.url.replace('http://localhost', '')
  
  if (path.startsWith('/api/health')) {
    const json = {status: 'OK'}
    return new Response(JSON.stringify(json), { status: 200, headers: {'content-type': 'application/json' }});
  }

  const obj = {
    msg: "Hello World"
  }
  return new Response(JSON.stringify(obj), { status: 200, headers: {'content-type': 'application/json' }});
};

console.log(`HTTP webserver running. Access it at: http://localhost:80/`);
await serve(handler, { port });