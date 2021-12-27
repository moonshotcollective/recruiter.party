### Contributing

### Picking issues

[ISSUES](https://github.com/moonshotcollective/recruiter.party/issues)

If you start working on an issue please assign it to yourself.

## Creating a new package

```bash
npx lerna create @scaffold-eth/<new-package>
```

## Publishing a package

```bash
npx lerna publish
```

### Publishing new Ceramic schemas

Edit the data model in packages/schemas and then run the following command in the same directory to generate a new model.json with the updated definitions

```bash
yarn build
```

### Redeploying the contracts on Mumbai

```bash
yarn deploy --network mumbai
```

and if you want to clear the state of the contract

```bash
yarn deploy --network mumbai --reset
```

Verify the contract, you'll need an API key from any block explorer,
eg for mumbai see signup & get it there https://polygonscan.com/myapikey

```bash
npx hardhat verify --network mumbai [CONTRACT_ADDRESS]
```

After each deployment, and depending on your network, you might need to modify the `BLOCK_EXPLORER_API_KEY` environment variable.
