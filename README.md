## JS w/out frameworks ##

### Setup ###

Go to the top level directory and run:

```
npm install
touch .env
```

Edit the .env file and set two environment variables:

```
NODE_ENV="development"
PORT=YOUR_PORT_NUMBER
```

Run `npm run dev`. Editing and saving changes to `index.html` or `index.js` should trigger a refresh with updated changes to the DOM and console. Run `npx eslint .` to lint JS files.
