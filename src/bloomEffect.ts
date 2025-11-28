/**
 * Creates a bloom emission effect with cyan dots that transition to purple
 * Particles explode from each active dot in the digit
 * Uses a single animation loop for optimal performance
 */

interface Particle {
  element: HTMLElement;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  startTime: number;
  duration: number;
  gravityStartTime: number;
}

// Global particle array and animation state
let particles: Particle[] = [];
let animationId: number | null = null;
let particleContainer: HTMLElement | null = null;
let lastAnimationTime: number = 0;

// Constants
const DAMPING = 0.98; // Velocity damping factor (friction)
const GRAVITY = 80; // Gravity constant (pixels per second squared)
const GRAVITY_START_TIME = 2000; // 2 seconds in milliseconds
const DURATION = 5000; // 5 seconds

/**
 * Calculate color based on progress (0 to 1)
 */
function calculateColor(progress: number): string {
  let r, g, b;
  
  if (progress < 0.33) {
    // Transition 1: Blue to Purple
    const t = progress / 0.33;
    r = Math.round(0 + (79 * t));       // 0 → 79
    g = Math.round(100 - (30 * t));     // 100 → 70
    b = Math.round(255 - (26 * t));     // 255 → 229
  } else if (progress < 0.66) {
    // Transition 2: Purple to Red
    const t = (progress - 0.33) / 0.33;
    r = Math.round(79 + (176 * t));     // 79 → 255
    g = Math.round(70 - (70 * t));      // 70 → 0
    b = Math.round(229 - (229 * t));    // 229 → 0
  } else {
    // Transition 3: Red to Yellow
    const t = (progress - 0.66) / 0.34;
    r = Math.round(255);                // 255 (stays)
    g = Math.round(0 + (255 * t));      // 0 → 255
    b = Math.round(0);                  // 0 (stays)
  }
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Single animation loop that updates all particles
 */
function animateParticles(currentTime: number): void {
  if (particles.length === 0) {
    // No particles, stop animation
    animationId = null;
    lastAnimationTime = 0;
    return;
  }
  
  // Calculate delta time (in seconds)
  const deltaTime = lastAnimationTime > 0 
    ? (currentTime - lastAnimationTime) / 1000 
    : 16 / 1000; // First frame, assume 60fps
  lastAnimationTime = currentTime;
  
  // Clamp delta time to prevent large jumps
  const clampedDeltaTime = Math.min(deltaTime, 0.1); // Max 100ms
  
  // Update all particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    const elapsed = currentTime - particle.startTime;
    const progress = Math.min(elapsed / particle.duration, 1);
    
    // Remove completed particles
    if (progress >= 1) {
      particle.element.remove();
      particles.splice(i, 1);
      continue;
    }
    
    // Apply velocity damping (friction)
    particle.velocityX *= DAMPING;
    particle.velocityY *= DAMPING;
    
    // Apply gravity after gravity start time
    if (elapsed >= particle.gravityStartTime) {
      // If particle is moving upward, slow it down more aggressively
      if (particle.velocityY < 0) {
        particle.velocityY *= 0.9;
        // Once upward velocity is very small, set to zero so gravity can take over
        if (particle.velocityY > -2) {
          particle.velocityY = 0;
        }
      }
      // Update velocity with gravity
      particle.velocityY += GRAVITY * clampedDeltaTime;
    }
    
    // Update position
    particle.x += particle.velocityX * clampedDeltaTime;
    particle.y += particle.velocityY * clampedDeltaTime;
    
    // Update DOM element
    particle.element.style.left = `${particle.x}px`;
    particle.element.style.top = `${particle.y}px`;
    
    // Update opacity (fade out over time)
    const opacity = 1 - progress;
    particle.element.style.opacity = opacity.toString();
    
    // Update scale (shrink over time)
    const scale = 1 - (progress * 0.5); // Scale from 1 to 0.5
    particle.element.style.transform = `scale(${scale})`;
    
    // Update color
    const color = calculateColor(progress);
    particle.element.style.backgroundColor = color;
    particle.element.style.boxShadow = `0 0 4px ${color}`;
  }
  
  // Continue animation
  animationId = requestAnimationFrame(animateParticles);
}

/**
 * Start the animation loop if not already running
 */
function startAnimationLoop(): void {
  if (animationId === null) {
    animationId = requestAnimationFrame(animateParticles);
  }
}

/**
 * Creates a bloom emission effect with cyan dots that transition to purple
 * Particles explode from each active dot in the digit
 * @param activeDots - Array of active dot elements to emit particles from
 * @param particlesPerDot - Number of particles per dot (default: 6)
 */
export function createBloomEffect(activeDots: HTMLElement[], particlesPerDot: number = 6): void {
  // Create container for particles if it doesn't exist
  if (!particleContainer) {
    particleContainer = document.getElementById('bloom-particles');
    if (!particleContainer) {
      particleContainer = document.createElement('div');
      particleContainer.id = 'bloom-particles';
      particleContainer.className = 'bloom-particles-container';
      document.body.appendChild(particleContainer);
    }
  }
  
  const startTime = performance.now();
  
  // Emit particles from each active dot
  activeDots.forEach((dot) => {
    const rect = dot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create particles for this dot
    for (let i = 0; i < particlesPerDot; i++) {
      const particle = document.createElement('div');
      particle.className = 'bloom-particle';
      
      // Initial velocity (explosion outward)
      const angle = Math.random() * Math.PI * 2;
      const initialSpeed = 80 + Math.random() * 60; // 80-140px/s initial speed
      const velocityX = Math.cos(angle) * initialSpeed;
      const velocityY = Math.sin(angle) * initialSpeed;
      
      // Set initial position
      const x = centerX;
      const y = centerY;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Set initial color (cyan)
      particle.style.backgroundColor = '#00ffff';
      particle.style.boxShadow = '0 0 4px #00ffff';
      
      particleContainer!.appendChild(particle);
      
      // Add particle to array
      particles.push({
        element: particle,
        x,
        y,
        velocityX,
        velocityY,
        startTime,
        duration: DURATION,
        gravityStartTime: GRAVITY_START_TIME
      });
    }
  });
  
  // Start animation loop if not already running
  startAnimationLoop();
}
