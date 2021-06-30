# ligature-js

An implementation of Ligature targeting the JS ecosystem mostly written in TypeScript.

## Testing

This project uses lerna so to run all the unit test suites issue the following command:

`lerna run test`

To run browser based tests issue the following command:

```
cd packages/ligature-indexeddb
npm run test-browser
```

and then go to https://localhost:1234

## Running Ligature-Lab

Ligature-Lab is a simple SvelteKit based web app that let's you experiment with Ligature locally.
To run Ligature-Lab:

```
cd packages/ligature-lab
npm run dev
```

and then go to https://localhost:3000
