# What I used and what you should have too

- pnpm
- typescript
- drizzle-kit
- postgresql
- docker (optional)
- shadcn/ui

## development

```bash
npm install -g pnpm
pnpm i
./dev up # start the database with docker
pnpm dev
pnpm ws-server # start the websocket server
```

db migration

```bash
pnpm drizzle-kit generate:pg # generate migration files
pnpm drizzle-kit push:pg     # apply migration files
```
![giphy](https://github.com/reol224/potential-octo-funicular/assets/27915379/984a71cf-f2c9-4bb3-ba82-8a2126666400)

