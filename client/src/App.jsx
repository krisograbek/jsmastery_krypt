import { Navbar, Footer, Services, Welcome, Transactions } from "./components"
import { DAppProvider, Rinkeby, Ropsten } from '@usedapp/core';

const config = {
  networks: [Rinkeby, Ropsten]
}

const App = () => {
  return (
    <DAppProvider config={config}>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>
        <Services />
        <Transactions />
        <Footer />
      </div>
    </DAppProvider>
  );
}

export default App;
