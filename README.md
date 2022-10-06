# This project based on NodeJS, ExpressJS, GraphQL and MongoDB. It is a simple shop app.

## Getting started

### Required technologies:

[NodeJS 16.x](https://nodejs.org/en/download/)

[docker v20.x](https://docs.docker.com/engine/install)

[docker-compose v1.29.x](https://docs.docker.com/compose/install)

### Folder structure

```
.
├── package.json        # Package.json for the whole repo
├── .env.example        # Contains sample content of .env and .env.ENVIRONMENT files
├── docker-compose.yml  # Configuration of docker services
├── scripts/            # Some helper scripts for docker-compose/migrations/code compiler
│── src/                # Your Main App specific TypeScript source code goes here
│── dist/               # Compiled JavaScript code goes here (DON'T WRITE CODE HERE)
```

### Getting started the development process

1. Install Dependencies (run script in the root directory)

   ```bash
   npm install
   ```

2. Create environment configs

   ```bash
   cp .env.example .env.development
   ```

3. Run docker services

   - For initialize

   ```bash
   docker-compose --env-file ./.env.development up -d --build
   ```

   - For destroy

   ```bash
   docker-compose --env-file ./.env.development down
   ```

   - For development start/stop

   ```bash
   docker-compose --env-file ./.env.development start -d
   ```

   and

   ```bash
   docker-compose --env-file ./.env.development stop -d
   ```

   - To see app logs

   ```bash
   docker-compose --env-file ./.env.development logs -f app
   ```

4. Run script to generate database

   ```bash
   npm run db:generate
   ```

5. Run the development server

   ```bash
   npm run watch
   ```
