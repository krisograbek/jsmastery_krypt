require('@nomiclabs/hardhat-waffle')
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  }
}

// https://eth-ropsten.alchemyapi.io/v2/f3JrW7xZbM0VHidKnwSvDv-EHoRbb1hI
