import { useState } from "react";
import { formatAddress } from "../services/stellar";

export default function WalletCard({
  publicKey,
  balance,
  isLoadingBalance,
  isFunding,
  onRefreshBalance,
  onFundAccount,
}) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="glass-card wallet-card animate-in" id="wallet-card">
      <div className="wallet-card-header">
        <span className="wallet-card-title">💳 Your Wallet</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onRefreshBalance}
          disabled={isLoadingBalance}
          id="refresh-balance-btn"
        >
          {isLoadingBalance ? (
            <span className="spinner" style={{ width: 14, height: 14 }}></span>
          ) : (
            "🔄 Refresh"
          )}
        </button>
      </div>

      <div className="wallet-address" onClick={copyAddress} title="Click to copy full address" id="wallet-address-display">
        <span>{formatAddress(publicKey, 8, 6)}</span>
        <span className="copy-icon" style={{ marginLeft: "auto" }}>
          {copied ? "✅" : "📋"}
        </span>
      </div>

      <div className="balance-display" id="balance-display">
        <div className="balance-label">Available Balance</div>
        {isLoadingBalance && balance === null ? (
          <div className="balance-amount" style={{ opacity: 0.4 }}>---</div>
        ) : (
          <div className="balance-amount">
            {parseFloat(balance || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </div>
        )}
        <div className="balance-currency">XLM (Lumens)</div>
      </div>

      <div className="wallet-actions">
        <button
          className="btn btn-success btn-sm"
          onClick={onFundAccount}
          disabled={isFunding}
          id="fund-account-btn"
        >
          {isFunding ? (
            <><span className="spinner" style={{width:14,height:14}}></span> Funding...</>
          ) : (
            "🚰 Fund with Friendbot"
          )}
        </button>
      </div>

      {copied && <div className="copied-toast">✅ Address copied to clipboard</div>}
    </div>
  );
}
