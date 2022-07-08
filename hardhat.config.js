import "@nomiclabs/hardhat-waffle"
import fs from 'fs'

const privateKey = fs.readFileSync('.secret').toString()
const projectId = 'a174d3e423c949a08952e47bc7b7a01a'

const hardhatConfig = {
  networks: {
    hardhat:{
      chainId: 1337
    },
    ropsten:{
      url: `https://ropsten.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};

export default hardhatConfig
