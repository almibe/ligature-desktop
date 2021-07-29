# ligature-js

An implementation of Ligature targeting the JS ecosystem mostly written in TypeScript.
See https://github.com/almibe/ligature-specification for the Ligature specification.

## Sub-packages

This repo contains multiple packages.
Below is a description of each.
They are all located within the `packages` directory.

| Name               | Description                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| ligature           | Main package contains shared types and interfaces, plus a couple helper/validation functions. |
| ligature-lab       | Browser based UI for experimenting with Ligature.                                             |
| lig                | A simple serialization format for Ligature.                                                   |
| wander             | A scripting language for interacting with Ligature.                                           |
| sol                | The Schema Ontology Layer for Ligature.                                                       |
| ligature-http      | An implementation of the ligature-http spec for nodejs.                                       |
| ligature-indexeddb | An implementation of Ligature using indexeddb as storage mainly meant for in browser usage.   |
| ligature-sqlite    | An implementation of Ligature using SQLite as storage for nodejs.                             |

## Testing

This project uses lerna so to run all the unit test suites issue the following command:

`lerna run test`

To run browser based tests issue the following commands:

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
