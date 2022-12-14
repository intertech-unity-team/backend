import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const mnemonic = "provide crew bracket pottery bird jewel dismiss ripple clever phone wonder someone";
const infura_api_key = "fcb9aa171b4f4fc1a600edf14953fcf9";
const infura_api_secret = "2607faa084b849d2914f6ccd7cf2c55a";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura_api_key}`,
      httpHeaders: {
        Authorization: `Basic ${Buffer.from(":" + infura_api_secret).toString("base64")}`,
      },
      accounts: {
        mnemonic,
      },
    }
  },
};

export default config;