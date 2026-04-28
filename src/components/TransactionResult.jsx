import { useState } from "react";
import { getExplorerLink } from "../services/stellar";

export default function TransactionResult({ txResult, onClear }) {
  const [copied, setCopied] = useState(false);

  if (!txResult) return null;

  const { success, hash, error, type } = txResult;

  const copyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  const typeLabel = type === "fund" ? "Funding" : "Payment";

  return (
    <div className="glass-card tx-result full-width animate-in-delay-2" id="transaction-result">
      <div className="tx-result-header">
        <div className={`tx-result-icon ${success ? "success" : "failure"}`}>
          {success ? "✅" : "❌"}
        </div>
        <div className="tx-result-text">
          <h3>{success ? `${typeLabel} Successful!` : `${typeLabel} Failed`}</h3>
          <p>
            {success
              ? type === "fund"
                ? "Your account has been funded with testnet XLM via Friendbot."
                : "Your XLM payment has been sent successfully on the Stellar testnet."
              : error || "An unknown error occurred. Please try again."}
          </p>
        </div>
      </div>

      {hash && (
        <div className="tx-hash-row" id="tx-hash-display">
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>TX Hash:</span>
          <span className="hash-text">{hash}</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={copyHash}
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
          >
            {copied ? "✅" : "📋"}
          </button>
        </div>
      )}

      <div className="tx-result-actions">
        {hash && (
          <a
            href={getExplorerLink(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            id="view-explorer-btn"
          >
            🔍 View on Explorer
          </a>
        )}
        <button className="btn btn-ghost btn-sm" onClick={onClear} id="dismiss-result-btn">
          ✕ Dismiss
        </button>
      </div>

      {copied && <div className="copied-toast">✅ Hash copied to clipboard</div>}
    </div>
  );
}
