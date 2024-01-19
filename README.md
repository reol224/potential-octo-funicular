# xxx

- pnpm
- typescript
- drizzle-kit
- postgresql
- docker
- [ui]

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

# 
