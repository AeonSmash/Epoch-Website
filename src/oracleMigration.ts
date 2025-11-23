const API_BASE = import.meta.env.VITE_EPOCH_API_BASE || 'https://epochstower-git-dev-aeonsmashs-projects.vercel.app/api';

let connectedWallet: string | null = null;
let verifiedName: string | null = null;

export function initOraclePage() {
  const statusEl = document.getElementById('oracle-status');
  const tokenInput = document.getElementById('oracle-token') as HTMLInputElement;
  const connectBtn = document.getElementById('oracle-connect-btn');
  const migrateBtn = document.getElementById('oracle-migrate-btn') as HTMLButtonElement;
  const walletInfo = document.getElementById('oracle-wallet-info');
  const walletAddressEl = document.getElementById('oracle-wallet-address');
  const nameNftEl = document.getElementById('oracle-name-nft');

  if (!statusEl || !tokenInput || !connectBtn || !migrateBtn || !walletInfo || !walletAddressEl || !nameNftEl) {
    console.error('[Oracle] Required DOM elements not found');
    return;
  }

  function setStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
  }

  // Auto-fill token from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const tokenParam = urlParams.get('token');
  if (tokenParam) {
    tokenInput.value = tokenParam.trim().toUpperCase();
  }

  // Connect Ethereum wallet (MetaMask)
  connectBtn.addEventListener('click', async () => {
    if (typeof window.ethereum === 'undefined') {
      setStatus('❌ MetaMask not found. Please install MetaMask to connect your Ethereum wallet.', 'error');
      return;
    }

    try {
      setStatus('⏳ Connecting to MetaMask...', 'info');

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        setStatus('❌ No accounts found. Please unlock MetaMask.', 'error');
        return;
      }

      connectedWallet = accounts[0];
      walletAddressEl.textContent = connectedWallet.substring(0, 6) + '...' + connectedWallet.substring(38);

      setStatus('⏳ Verifying Decentraland Name NFT ownership...', 'info');

      // Verify wallet owns a Decentraland Name NFT
      const verifyUrl = `${API_BASE}/player/verify_name_nft?wallet=${encodeURIComponent(connectedWallet)}`;
      const verifyRes = await fetch(verifyUrl, { method: 'GET' });

      if (!verifyRes.ok) {
        setStatus('❌ Could not verify Name NFT ownership. Make sure you own a Decentraland Name NFT.', 'error');
        return;
      }

      const verifyData = await verifyRes.json();
      if (!verifyData.ok || !verifyData.name) {
        setStatus('❌ This wallet does not own a Decentraland Name NFT. Please connect a wallet that owns one.', 'error');
        return;
      }

      verifiedName = verifyData.name;
      nameNftEl.textContent = verifiedName;
      walletInfo.style.display = 'block';
      migrateBtn.disabled = false;
      migrateBtn.style.opacity = '1';

      setStatus(`✅ Wallet connected and Name NFT verified: ${verifiedName}`, 'success');
    } catch (err: any) {
      console.error('[Oracle] Connect error:', err);
      setStatus(`❌ ${err.message || 'Failed to connect wallet. Check console for details.'}`, 'error');
    }
  });

  // Migrate progress
  migrateBtn.addEventListener('click', async () => {
    const token = (tokenInput.value || '').trim().toUpperCase();

    if (!token) {
      setStatus('❌ Please enter your migration token.', 'error');
      return;
    }

    if (!connectedWallet) {
      setStatus('❌ Please connect your Ethereum wallet first.', 'error');
      return;
    }

    if (!verifiedName) {
      setStatus('❌ Name NFT verification failed. Please reconnect your wallet.', 'error');
      return;
    }

    // Confirm migration
    const confirmMsg = `Migrate progress to "${verifiedName}"?\n\nThis will transfer all your game progress from your free name to this paid name NFT.`;
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      setStatus('⏳ Migrating progress...', 'info');
      migrateBtn.disabled = true;

      const migrateUrl = `${API_BASE}/player/migrate`;
      const migrateRes = await fetch(migrateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          migration_token: token,
          wallet_address: connectedWallet,
          new_decentraland_name: verifiedName
        })
      });

      console.log('[Oracle] Migration response status:', migrateRes.status);

      if (!migrateRes.ok) {
        const errorText = await migrateRes.text();
        console.error('[Oracle] Error response:', errorText);
        throw new Error(`Server error: ${migrateRes.status} ${errorText}`);
      }

      const migrateData = await migrateRes.json();
      console.log('[Oracle] Migration response:', migrateData);

      if (migrateData.ok) {
        setStatus(`✅ Migration successful!\n\n${migrateData.message}\n\nReturn to Decentraland and enter with your new name to continue playing.`, 'success');
        migrateBtn.style.display = 'none';
        tokenInput.disabled = true;
      } else {
        setStatus(`❌ ${migrateData.message || 'Migration failed.'}`, 'error');
        migrateBtn.disabled = false;
      }
    } catch (err: any) {
      console.error('[Oracle] Migration error:', err);
      setStatus(`❌ ${err.message || 'Failed to migrate. Check console for details.'}`, 'error');
      migrateBtn.disabled = false;
    }
  });
}

