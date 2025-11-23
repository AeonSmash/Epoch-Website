import { initPortalPage } from './portal';
import { initOraclePage } from './oracleMigration';
import { initThreeScene } from './threeScene';

let cleanupThreeScene: (() => void) | null = null;

function initRouting() {
  const portalPage = document.getElementById('portal-page');
  const oraclePage = document.getElementById('oracle-page');
  const threeContainer = document.getElementById('three-container');

  function showPage(pageId: 'portal' | 'oracle') {
    // Hide all pages
    if (portalPage) portalPage.classList.remove('active');
    if (oraclePage) oraclePage.classList.remove('active');

    // Cleanup Three.js scene if switching away from Oracle
    if (cleanupThreeScene) {
      cleanupThreeScene();
      cleanupThreeScene = null;
    }

    // Show selected page
    if (pageId === 'portal') {
      if (portalPage) {
        portalPage.classList.add('active');
        initPortalPage();
      }
    } else if (pageId === 'oracle') {
      if (oraclePage && threeContainer) {
        oraclePage.classList.add('active');
        initOraclePage();
        // Initialize Three.js scene for Oracle page
        cleanupThreeScene = initThreeScene(threeContainer);
      }
    }
  }

  // Handle hash changes
  function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'portal';
    if (hash === 'oracle' || hash === 'portal') {
      showPage(hash);
    } else {
      showPage('portal');
    }
  }

  // Handle initial load
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);

  // Handle navigation links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        window.location.hash = href;
      }
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouting);
} else {
  initRouting();
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[Global] Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global] Unhandled promise rejection:', event.reason);
});

