export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          Built with 💜 on the <strong>Stellar Network</strong> · Testnet Only
        </p>
        <div className="footer-links">
          <a href="https://stellar.org" target="_blank" rel="noopener noreferrer">
            Stellar.org
          </a>
          <a href="https://developers.stellar.org" target="_blank" rel="noopener noreferrer">
            Docs
          </a>
          <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer">
            Explorer
          </a>
          <a href="https://freighter.app" target="_blank" rel="noopener noreferrer">
            Freighter
          </a>
          <a href="https://laboratory.stellar.org" target="_blank" rel="noopener noreferrer">
            Laboratory
          </a>
        </div>
      </div>
    </footer>
  );
}
