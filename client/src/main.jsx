import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { TransactionProvider } from './context/TransactionContext';
import { DAppProvider, Rinkeby, Ropsten } from '@usedapp/core';

const config = {
  networks: [Rinkeby, Ropsten]
}

ReactDOM.render(
  <DAppProvider config={config}>
    <TransactionProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </TransactionProvider>
  </DAppProvider>,
  document.getElementById('root')
)
