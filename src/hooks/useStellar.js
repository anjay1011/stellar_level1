import { useState, useCallback, useRef } from "react";
import {
  checkFreighter,
  connectWallet as connectWalletService,
  getBalance as getBalanceService,
  sendPayment as sendPaymentService,
  fundWithFriendbot as fundWithFriendbotService,
} from "../services/stellar";

export function useStellar() {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [freighterInstalled, setFreighterInstalled] = useState(null);
  const [txResult, setTxResult] = useState(null);
  const [error, setError] = useState(null);

  const balanceTimer = useRef(null);

  const checkFreighterInstalled = useCallback(async () => {
    const installed = await checkFreighter();
    setFreighterInstalled(installed);
    return installed;
  }, []);

  const fetchBalance = useCallback(async (key) => {
    const addr = key || publicKey;
    if (!addr) return;
    setIsLoadingBalance(true);
    try {
      const bal = await getBalanceService(addr);
      setBalance(bal);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const key = await connectWalletService();
      setPublicKey(key);
      await fetchBalance(key);
      return key;
    } catch (err) {
      if (err.message === "FREIGHTER_NOT_INSTALLED") {
        setFreighterInstalled(false);
      }
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setBalance(null);
    setTxResult(null);
    setError(null);
    if (balanceTimer.current) clearInterval(balanceTimer.current);
  }, []);

  const sendPayment = useCallback(async (destination, amount, memo) => {
    if (!publicKey) throw new Error("Wallet not connected");
    setIsSending(true);
    setTxResult(null);
    setError(null);
    try {
      const result = await sendPaymentService(publicKey, destination, amount, memo);
      setTxResult({ ...result, type: "send" });
      await fetchBalance();
      return result;
    } catch (err) {
      const failResult = { success: false, error: err.message, type: "send" };
      setTxResult(failResult);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [publicKey, fetchBalance]);

  const fundAccount = useCallback(async () => {
    if (!publicKey) throw new Error("Wallet not connected");
    setIsFunding(true);
    setTxResult(null);
    setError(null);
    try {
      const result = await fundWithFriendbotService(publicKey);
      setTxResult({ ...result, type: "fund" });
      await fetchBalance();
      return result;
    } catch (err) {
      const failResult = { success: false, error: err.message, type: "fund" };
      setTxResult(failResult);
      throw err;
    } finally {
      setIsFunding(false);
    }
  }, [publicKey, fetchBalance]);

  const clearTxResult = useCallback(() => setTxResult(null), []);
  const clearError = useCallback(() => setError(null), []);

  return {
    publicKey,
    balance,
    isConnecting,
    isLoadingBalance,
    isSending,
    isFunding,
    freighterInstalled,
    txResult,
    error,
    checkFreighterInstalled,
    connect,
    disconnect,
    fetchBalance,
    sendPayment,
    fundAccount,
    clearTxResult,
    clearError,
  };
}
