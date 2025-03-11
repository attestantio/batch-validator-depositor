// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Defaults for deployment.
const MAINNET_DEPLOY = false;
const CONTRACT_ADDRESS = '0x4242424242424242424242424242424242424242';

const BatchValidatorDepositorModule = buildModule("BatchValidatorDepositorModule", (m) => {
  const mainnetDeploy = m.getParameter("mainnetDeploy", MAINNET_DEPLOY);
  const contractAddress = m.getParameter("contractAddress", CONTRACT_ADDRESS);

  const batchValidatorDepositor = m.contract("BatchValidatorDepositor", [mainnetDeploy, contractAddress]);

  return { batchValidatorDepositor };
});

export default BatchValidatorDepositorModule;
