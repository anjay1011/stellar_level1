import { useEffect } from "react";
import { useStellar } from "./hooks/useStellar";
import Header from "./components/Header";
import WalletCard from "./components/WalletCard";
import SendPayment from "./components/SendPayment";
import TransactionResult from "./components/TransactionResult";
import FreighterDetect from "./components/FreighterDetect";
import Footer from "./components/Footer";

export default function App() {
  const {
    publicKey,
    balance,
    isConnecting,
    isLoadingBalance,
    isSending,
    isFunding,
    freighterInstalled,
    txResult,
    checkFreighterInstalled,
    connect,
    disconnect,
    fetchBalance,
    sendPayment,
    fundAccount,
    clearTxResult,
  } = useStellar();

  useEffect(() => {
    checkFreighterInstalled();
  }, [checkFreighterInstalled]);

  const isConnected = !!publicKey;

  return (
    <>
      <Header
        publicKey={publicKey}
        isConnecting={isConnecting}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      <main className="container" style={{ flex: 1 }}>
        <FreighterDetect freighterInstalled={freighterInstalled} />

        {!isConnected ? (
          <section className="hero" id="hero-section">
            <div className="hero-icon">🚀</div>
            <h1>StellarPay</h1>
            <p>
              Send XLM payments on the Stellar testnet. Connect your Freighter
              wallet to get started.
            </p>
            <div className="hero-features">
              <div className="hero-feature">
                <span>🔗</span> Wallet Connect
              </div>
              <div className="hero-feature">
                <span>💰</span> Live Balance
              </div>
              <div className="hero-feature">
                <span>💸</span> Send XLM
              </div>
              <div className="hero-feature">
                <span>🚰</span> Testnet Faucet
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={connect}
              disabled={isConnecting}
              id="hero-connect-btn"
            >
              {isConnecting ? (
                <>
                  <span className="spinner"></span> Connecting...
                </>
              ) : (
                "🔗 Connect Freighter Wallet"
              )}
            </button>
          </section>
        ) : (
          <div className="dashboard-grid" id="dashboard">
            <WalletCard
              publicKey={publicKey}
              balance={balance}
              isLoadingBalance={isLoadingBalance}
              isFunding={isFunding}
              onRefreshBalance={() => fetchBalance()}
              onFundAccount={fundAccount}
            />
            <SendPayment
              isSending={isSending}
              balance={balance}
              onSend={sendPayment}
            />
            {txResult && (
              <TransactionResult txResult={txResult} onClear={clearTxResult} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
