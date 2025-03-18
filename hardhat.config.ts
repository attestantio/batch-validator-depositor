import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mainnet: {
      chainId: 1,
      url: vars.get("RPC_ENDPOINT_URL", "http://localhost:8545"),
      accounts: vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [],
    },
    holesky: {
      chainId: 17000,
      url: vars.get("RPC_ENDPOINT_URL", "http://localhost:8545"),
      accounts: vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [],
    },
    hoodi: {
      chainId: 560048,
      url: vars.get("RPC_ENDPOINT_URL", "http://localhost:8545"),
      accounts: vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [],
    }
  }
};

export default config;
