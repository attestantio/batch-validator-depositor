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
  networks: {
    holesky: {
      url: process.env.HOLESKY_RPC_ENDPOINT_URL,
      accounts: [process.env.HOLESKY_PRIVATE_KEY]
    }
  }
};

export default config;
