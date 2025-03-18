# Ethereum batch valdiator depositor

This contract allows multiple Ethereum validators to be deposited in a single transaction.

The contract is deployed at the following addresses:

holesky: `0x81723BC1872C440454BC88D85bA31C7F75d15ae1`
hoodi: `0xCdF49FC9134B7029d90d01B92e59014cedc9dE6A`

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

After the deployment has completed the variables should be removed:

```shell
npx hardhat vars delete RPC_ENDPOINT_URL
npx hardhat vars delete PRIVATE_KEY
```


## Using

The contract comes with a single operational function, `deposit`.  The signature of `deposit` is:

```solidity
deposit(bytes[] calldata pubkeys, bytes[] calldata withdrawal_credentials, bytes[] calldata signatures, bytes32[] calldata deposit_data_roots, uint256[] calldata collateral)
```

The parameters are as follows:

- `pubkeys` an array of 48-byte public keys
- `withdrawal_credentials` an array of 32-byte withdrawal credentials
- `signatures` an array of 96-byte signatures
- `deposit_data_roots` an array of byte32 deposit data roots
- `collateral` an array of uint256 wei-amount collaterals

The individual deposits are made from each set of values in the arrays, allowing a mixture of items such as withdrawal credentials and collateral.

The function will allow deposits from 1 to 100 validators.
