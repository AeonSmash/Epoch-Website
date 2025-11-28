/**
 * Ripple/Wave Effects
 * Creates concentric ripples when minutes change
 */

interface Ripple {
  element: HTMLElement;
  startTime: number;
  duration: number;
  centerX: number;
  centerY: number;
}

let ripples: Ripple[] = [];
let rippleContainer: HTMLElement | null = null;
let rippleAnimationId: number | null = null;

const RIPPLE_DURATION = 2000; // 2 seconds
const RIPPLE_MAX_RADIUS = 800; // Maximum radius in pixels

/**
 * Create a ripple effect at the center of the countdown display
 */
export function createRippleEffect(): void {
  // Get container if it doesn't exist
  if (!rippleContainer) {
    rippleContainer = document.getElementById('ripple-container');
    if (!rippleContainer) {
      rippleContainer = document.createElement('div');
      rippleContainer.id = 'ripple-container';
      rippleContainer.className = 'ripple-container';
      document.body.appendChild(rippleContainer);
    }
  }
  
  // Find center of countdown display
  const countdownDisplay = document.querySelector('.countdown-display') as HTMLElement;
  if (!countdownDisplay) return;
  
  const rect = countdownDisplay.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create ripple element
  const ripple = document.createElement('div');
  ripple.className = 'ripple-wave';
  ripple.style.left = `${centerX}px`;
  ripple.style.top = `${centerY}px`;
  ripple.style.transform = 'translate(-50%, -50%)';
  
  rippleContainer.appendChild(ripple);
  
  const startTime = performance.now();
  
  ripples.push({
    element: ripple,
    startTime,
    duration: RIPPLE_DURATION,
    centerX,
    centerY
  });
  
  // Start animation if not running
  if (rippleAnimationId === null) {
    rippleAnimationId = requestAnimationFrame(animateRipples);
  }
}

/**
 * Animate all ripples
 */
function animateRipples(currentTime: number): void {
  if (ripples.length === 0) {
    rippleAnimationId = null;
    return;
  }
  
  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i];
    const elapsed = currentTime - ripple.startTime;
    const progress = Math.min(elapsed / ripple.duration, 1);
    
    if (progress >= 1) {
      // Remove completed ripple
      ripple.element.remove();
      ripples.splice(i, 1);
      continue;
    }
    
    // Calculate radius
    const radius = progress * RIPPLE_MAX_RADIUS;
    ripple.element.style.width = `${radius * 2}px`;
    ripple.element.style.height = `${radius * 2}px`;
    
    // Update opacity (fade out)
    const opacity = 1 - progress;
    ripple.element.style.opacity = opacity.toString();
    
    // Update border width (thinner as it expands)
    const borderWidth = Math.max(2, 4 - (progress * 2));
    ripple.element.style.borderWidth = `${borderWidth}px`;
  }
  
  // Continue animation
  if (ripples.length > 0) {
    rippleAnimationId = requestAnimationFrame(animateRipples);
  } else {
    rippleAnimationId = null;
  }
}

