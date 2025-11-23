const API_BASE = import.meta.env.VITE_EPOCH_API_BASE || 'https://epochstower-git-dev-aeonsmashs-projects.vercel.app/api';
const DCL_URL = 'https://decentraland.org/play/?position=%3D-92%2C73';

export function initPortalPage() {
  const dclBtn = document.getElementById('dcl-btn');
  const claimBtn = document.getElementById('claim-btn');
  const claimInput = document.getElementById('claim-code') as HTMLInputElement;
  const claimStatus = document.getElementById('claim-status');

  if (!dclBtn || !claimBtn || !claimInput || !claimStatus) {
    console.error('[Portal] Required DOM elements not found');
    return;
  }

  // Decentraland entry button
  dclBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(DCL_URL, '_blank', 'noopener');
  });

  // Claim/Redeem functionality
  claimBtn.addEventListener('click', async () => {
    const claimCode = claimInput.value.trim();
    if (!claimCode) {
      setClaimStatus('❌ Please enter your claim code.', 'error');
      return;
    }

    setClaimStatus('⏳ Opening Phantom wallet... Please authorize the connection.', 'info');
    try {
      const wallet = await connectPhantom();
      console.log('[Portal] Wallet connected:', wallet);

      setClaimStatus('⏳ Sending claim...', 'info');
      const url = `${API_BASE}/redeem`;
      console.log('[Portal] Calling:', url);
      console.log('[Portal] Body:', { code: claimCode, wallet });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: claimCode, wallet })
      });

      console.log('[Portal] Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[Portal] Error response:', errorText);
        throw new Error(`Server error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log('[Portal] Response:', data);

      if (data.ok) {
        setClaimStatus(`✅ Claimed! Tx: ${data.signature || 'success'}`, 'success');
      } else {
        setClaimStatus(`❌ ${data.message || 'Claim failed.'}`, 'error');
      }
    } catch (err: any) {
      console.error('[Portal] Claim error:', err);
      setClaimStatus(`❌ ${err.message || 'Failed to connect. Check console for details.'}`, 'error');
    }
  });

  function setClaimStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
    claimStatus.textContent = message;
    claimStatus.className = `status-message ${type}`;
  }
}

async function connectPhantom(): Promise<string> {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error('Phantom wallet not found. Install Phantom and refresh.');
  }

  // Disconnect first if already connected to ensure fresh authorization
  try {
    if (window.solana.isConnected) {
      await window.solana.disconnect();
    }
  } catch (e) {
    console.log('[Portal] Disconnect error (ignoring):', e);
  }

  // Force connection prompt by using onlyIfTrusted: false
  const resp = await window.solana.connect({ onlyIfTrusted: false });

  // Request message signature for additional authorization verification
  try {
    const message = 'Epoch The Endless Tower: Link your wallet to access the game.';
    const encodedMessage = new TextEncoder().encode(message);
    await window.solana.signMessage!(encodedMessage, 'utf8');
    console.log('[Portal] Message signed');
  } catch (signErr) {
    // If signing fails, we still proceed with connection
    console.warn('[Portal] Sign message failed (continuing anyway):', signErr);
  }

  console.log('[Portal] Wallet connected and authorized:', resp.publicKey.toString());
  return resp.publicKey.toString();
}




