# PKMN Move Coverage #

### Setup ###

Go to both the `client` and `server` directories and run:

```
npm install
touch .env
```

Edit the `.env` file to set two environment variables:

```
NODE_ENV="development"
PORT=YOUR_PORT_NUMBER
```

Run `npm run build` inside the `client` directory, then `cd` to the `server` directory in order to run `node server.js`. Run `npx eslint .` to lint JS files.
