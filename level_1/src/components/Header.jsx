export default function Header({ publicKey, isConnecting, onConnect, onDisconnect }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-brand">
          <div className="header-logo">S</div>
          <span className="header-title">StellarPay</span>
        </div>
        <div className="header-right">
          <div className="network-badge">
            <span className="network-dot"></span>
            Testnet
          </div>
          {publicKey ? (
            <button className="btn btn-ghost btn-sm" onClick={onDisconnect} id="disconnect-btn">
              Disconnect
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onConnect}
              disabled={isConnecting}
              id="connect-wallet-btn"
            >
              {isConnecting ? (
                <><span className="spinner" style={{width:14,height:14}}></span> Connecting...</>
              ) : (
                "🔗 Connect Wallet"
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
