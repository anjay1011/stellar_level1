export default function FreighterDetect({ freighterInstalled }) {
  // null = hasn't checked yet, true = installed, false = not installed
  if (freighterInstalled === null || freighterInstalled === true) return null;

  return (
    <div className="freighter-banner" id="freighter-banner">
      <div className="freighter-banner-inner">
        <span className="freighter-banner-icon">⚠️</span>
        <div className="freighter-banner-content">
          <h3>Freighter Wallet Required</h3>
          <p>
            To use StellarPay, you need the Freighter browser extension installed and
            configured to the Stellar Testnet.
          </p>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              Install the{" "}
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer">
                Freighter Browser Extension
              </a>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              Create or import a Stellar wallet
            </div>
            <div className="step">
              <span className="step-number">3</span>
              Switch to <strong>Testnet</strong> in Freighter Settings → Network
            </div>
            <div className="step">
              <span className="step-number">4</span>
              Refresh this page and click "Connect Wallet"
            </div>
          </div>
          <a
            href="https://freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            id="install-freighter-btn"
          >
            📥 Install Freighter
          </a>
        </div>
      </div>
    </div>
  );
}
