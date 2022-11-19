FROM denoland/deno:1.28.1

EXPOSE 80

WORKDIR /app

RUN deno install -A https://deno.land/std@0.165.0/http/file_server.ts

USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache main.ts

CMD ["file_server", "-p", "80", "./static" ]