import { useState } from "react";

export default function SendPayment({ isSending, balance, onSend }) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!destination.trim()) {
      newErrors.destination = "Recipient address is required";
    } else if (destination.length !== 56 || !destination.startsWith("G")) {
      newErrors.destination = "Invalid Stellar address (must start with G, 56 characters)";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (balance && num > parseFloat(balance) - 1) {
        newErrors.amount = "Insufficient balance (keep at least 1 XLM as reserve)";
      }
    }

    if (memo && memo.length > 28) {
      newErrors.memo = "Memo must be 28 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSend(destination.trim(), amount.trim(), memo.trim());
      setDestination("");
      setAmount("");
      setMemo("");
      setErrors({});
    } catch {
      // Error handled by parent via txResult
    }
  };

  return (
    <div className="glass-card animate-in-delay-1" id="send-payment-card">
      <form className="send-payment" onSubmit={handleSubmit}>
        <div className="send-payment-title">
          <span>💸</span>
          <span>Send XLM</span>
        </div>

        <div className="input-group">
          <label htmlFor="recipient-address">Recipient Address</label>
          <input
            type="text"
            id="recipient-address"
            className={`input-field input-mono ${errors.destination ? "error" : ""}`}
            placeholder="GABCD...WXYZ"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (errors.destination) setErrors((p) => ({ ...p, destination: null }));
            }}
            disabled={isSending}
          />
          {errors.destination && <span className="input-error">{errors.destination}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="send-amount">
            Amount (XLM)
            {balance && (
              <span style={{ float: "right", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                Max: {(parseFloat(balance) - 1).toFixed(2)} XLM
              </span>
            )}
          </label>
          <input
            type="number"
            id="send-amount"
            className={`input-field ${errors.amount ? "error" : ""}`}
            placeholder="0.00"
            step="0.0000001"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors((p) => ({ ...p, amount: null }));
            }}
            disabled={isSending}
          />
          {errors.amount && <span className="input-error">{errors.amount}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="send-memo">Memo (Optional)</label>
          <input
            type="text"
            id="send-memo"
            className={`input-field ${errors.memo ? "error" : ""}`}
            placeholder="e.g., Payment for coffee"
            maxLength={28}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={isSending}
          />
          {errors.memo && <span className="input-error">{errors.memo}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSending}
          id="send-payment-btn"
        >
          {isSending ? (
            <><span className="spinner"></span> Sending...</>
          ) : (
            "🚀 Send Payment"
          )}
        </button>
      </form>
    </div>
  );
}
