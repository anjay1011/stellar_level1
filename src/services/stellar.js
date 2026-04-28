import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

import * as StellarSdk from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const FRIENDBOT_URL = "https://friendbot.stellar.org";

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Check if Freighter extension is installed and available
 */
export async function checkFreighter() {
  try {
    const connected = await isConnected();
    return !!connected;
  } catch {
    return false;
  }
}

/**
 * Connect to Freighter wallet and return the public key
 */
export async function connectWallet() {
  const freighterAvailable = await checkFreighter();
  if (!freighterAvailable) {
    throw new Error("FREIGHTER_NOT_INSTALLED");
  }

  try {
    const publicKey = await requestAccess();
    if (!publicKey) {
      throw new Error("User denied wallet access");
    }
    return publicKey;
  } catch (err) {
    if (err.message === "FREIGHTER_NOT_INSTALLED") throw err;
    throw new Error("Failed to connect wallet: " + err.message);
  }
}

/**
 * Fetch XLM balance for a public key
 */
export async function getBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );
    return nativeBalance ? nativeBalance.balance : "0";
  } catch (err) {
    if (err?.response?.status === 404) {
      return "0";
    }
    throw new Error("Failed to fetch balance: " + err.message);
  }
}

/**
 * Fund account using Stellar Friendbot (testnet only)
 */
export async function fundWithFriendbot(publicKey) {
  try {
    const response = await fetch(`${FRIENDBOT_URL}?addr=${publicKey}`);
    if (!response.ok) {
      const text = await response.text();
      if (text.includes("createAccountAlready")) {
        throw new Error("Account already funded. You can only use Friendbot once per account.");
      }
      throw new Error("Friendbot request failed");
    }
    const data = await response.json();
    return {
      success: true,
      hash: data.hash || data.id || "funded",
    };
  } catch (err) {
    throw new Error(err.message || "Failed to fund account");
  }
}

/**
 * Send XLM payment
 * Builds TX -> Freighter signs -> Submit to Horizon
 */
export async function sendPayment(senderPublicKey, destination, amount, memo) {
  if (!StellarSdk.StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error("Invalid destination address");
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  try {
    const sourceAccount = await server.loadAccount(senderPublicKey);

    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Check if destination account exists
    let destinationExists = true;
    try {
      await server.loadAccount(destination);
    } catch {
      destinationExists = false;
    }

    if (destinationExists) {
      txBuilder.addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount: numAmount.toFixed(7),
        })
      );
    } else {
      // Account doesn't exist yet, use createAccount
      txBuilder.addOperation(
        StellarSdk.Operation.createAccount({
          destination,
          startingBalance: numAmount.toFixed(7),
        })
      );
    }

    if (memo && memo.trim()) {
      txBuilder.addMemo(StellarSdk.Memo.text(memo.trim().substring(0, 28)));
    }

    const transaction = txBuilder.setTimeout(30).build();
    const xdr = transaction.toXDR();

    // Sign with Freighter
    const signedXdr = await signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (!signedXdr) {
      throw new Error("Transaction signing was cancelled");
    }

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(signedTx);

    return {
      success: true,
      hash: result.hash,
    };
  } catch (err) {
    const message = err?.response?.data?.extras?.result_codes
      ? JSON.stringify(err.response.data.extras.result_codes)
      : err.message;
    throw new Error(message || "Transaction failed");
  }
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddress(address, start = 6, end = 4) {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Get Stellar Expert explorer link for a transaction
 */
export function getExplorerLink(hash) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
