import { initCountdown } from './countdown';

// Initialize countdown on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
  });
} else {
  initCountdown();
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[Global] Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global] Unhandled promise rejection:', event.reason);
});
