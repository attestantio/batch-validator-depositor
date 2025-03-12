# Ethereum batch valdiator depositor

This contract allows multiple Ethereum validators to be deposited in a single transaction.

The contract is deployed at the following addresses:

holesky: `0x81723BC1872C440454BC88D85bA31C7F75d15ae1`

## Tests

Contract tests can be run as follows:

```shell
npx hardhat test
```

## Deploying

Deploying the contract to a custom network requires updating `hardhat.config.ts` to include the network definition.

The following variables are required to be set when deploying the contract:

- `RPC_ENDPOINT_URL`: the URL to an Ethereum execution node on the given network; defaults to `http://localhost:8545`
- `PRIVATE_KEY`: the private key of the Ethereum address that will deploy the contract (note that the address needs to be funded to create the contract)

These variables should be set before deployment, for example:

```shell
npx hardhat vars set RPC_ENDPOINT_URL
npx hardhat vars set PRIVATE_KEY
```

Once the above has been configured, the contract can be deployed as follows:

```shell
npx hardhat ignition deploy --network <network> ignition/modules/BatchValidatorDepositor.ts
```
