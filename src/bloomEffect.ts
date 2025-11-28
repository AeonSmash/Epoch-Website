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
  trail: Array<{ x: number; y: number; time: number; color: string }>;
  lastTrailTime: number;
}

// Global particle array and animation state
let particles: Particle[] = [];
let animationId: number | null = null;
let particleContainer: HTMLElement | null = null;
let lastAnimationTime: number = 0;

/**
 * Update particle trail visualization
 */
function updateParticleTrail(particle: Particle, currentTime: number): void {
  // Remove old trail elements
  const existingTrails = particle.element.parentElement?.querySelectorAll(`[data-trail-for="${particle.element.id}"]`);
  existingTrails?.forEach(trail => trail.remove());
  
  // Create trail elements
  particle.trail.forEach((point, index) => {
    const age = currentTime - point.time;
    const maxAge = 1000; // Trail fades over 1 second (extended to match longer particle duration)
    if (age > maxAge) return;
    
    const trailOpacity = 1 - (age / maxAge);
    const trailSize = 2 + (index * 0.1); // Slightly larger for older points
    
    // Extract RGB from color string
    const rgbMatch = point.color.match(/\d+/g);
    const r = rgbMatch ? parseInt(rgbMatch[0]) : 0;
    const g = rgbMatch ? parseInt(rgbMatch[1]) : 255;
    const b = rgbMatch ? parseInt(rgbMatch[2]) : 255;
    
    const trailElement = document.createElement('div');
    trailElement.className = 'bloom-particle-trail';
    trailElement.setAttribute('data-trail-for', particle.element.id);
    trailElement.style.left = `${point.x}px`;
    trailElement.style.top = `${point.y}px`;
    trailElement.style.backgroundColor = point.color;
    trailElement.style.opacity = (trailOpacity * 0.4).toString(); // Max 40% opacity
    trailElement.style.width = `${trailSize}px`;
    trailElement.style.height = `${trailSize}px`;
    // Trail glow also fades out
    const trailGlowOpacity = trailOpacity * 0.6;
    trailElement.style.boxShadow = `0 0 ${trailSize * 2}px rgba(${r}, ${g}, ${b}, ${trailGlowOpacity})`;
    
    particleContainer!.insertBefore(trailElement, particle.element);
  });
}

// Constants
const DAMPING = 0.98; // Velocity damping factor (friction)
const GRAVITY = 80; // Gravity constant (pixels per second squared)
const GRAVITY_START_TIME = 2000; // 2 seconds in milliseconds
const DURATION = 8000; // 8 seconds - extended to allow particles to fully fade out

/**
 * Calculate color based on progress (0 to 1)
 * Returns both RGB string and RGB values
 */
function calculateColor(progress: number): { rgb: string; r: number; g: number; b: number } {
  let r, g, b;
  
  if (progress < 0.25) {
    // Transition 1: Blue to Purple (0-25%)
    const t = progress / 0.25;
    r = Math.round(0 + (79 * t));       // 0 → 79
    g = Math.round(100 - (30 * t));     // 100 → 70
    b = Math.round(255 - (26 * t));     // 255 → 229
  } else if (progress < 0.5) {
    // Transition 2: Purple to Red (25-50%)
    const t = (progress - 0.25) / 0.25;
    r = Math.round(79 + (176 * t));     // 79 → 255
    g = Math.round(70 - (70 * t));      // 70 → 0
    b = Math.round(229 - (229 * t));    // 229 → 0
  } else if (progress < 0.75) {
    // Transition 3: Red to Yellow (50-75%)
    const t = (progress - 0.5) / 0.25;
    r = Math.round(255);                // 255 (stays)
    g = Math.round(0 + (255 * t));      // 0 → 255
    b = Math.round(0);                  // 0 (stays)
  } else {
    // Transition 4: Yellow to Black (75-100%)
    const t = (progress - 0.75) / 0.25;
    r = Math.round(255 - (255 * t));    // 255 → 0
    g = Math.round(255 - (255 * t));    // 255 → 0
    b = Math.round(0);                  // 0 (stays)
  }
  
  return { rgb: `rgb(${r}, ${g}, ${b})`, r, g, b };
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
      // Clean up trail elements
      const existingTrails = particleContainer?.querySelectorAll(`[data-trail-for="${particle.element.id}"]`);
      existingTrails?.forEach(trail => trail.remove());
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
    const prevX = particle.x;
    const prevY = particle.y;
    particle.x += particle.velocityX * clampedDeltaTime;
    particle.y += particle.velocityY * clampedDeltaTime;
    
    // Add trail point every 16ms (roughly 60fps)
    const timeSinceLastTrail = currentTime - particle.lastTrailTime;
    if (timeSinceLastTrail >= 16) {
      const colorData = calculateColor(progress);
      particle.trail.push({
        x: prevX,
        y: prevY,
        time: currentTime,
        color: colorData.rgb
      });
      particle.lastTrailTime = currentTime;
      
      // Keep only last 20 trail points
      if (particle.trail.length > 20) {
        particle.trail.shift();
      }
    }
    
    // Update trail elements
    updateParticleTrail(particle, currentTime);
    
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
    const colorData = calculateColor(progress);
    particle.element.style.backgroundColor = colorData.rgb;
    // Enhanced glow with multiple layers for brighter bloom - fade out with particle opacity
    const glowOpacity1 = 0.8 * opacity;
    const glowOpacity2 = 0.5 * opacity;
    const glowOpacity3 = 0.3 * opacity;
    const colorRgba1 = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${glowOpacity1})`;
    const colorRgba2 = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${glowOpacity2})`;
    const colorRgba3 = `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${glowOpacity3})`;
    const mainGlowOpacity = opacity;
    particle.element.style.boxShadow = `0 0 12px rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${mainGlowOpacity}), 0 0 20px ${colorRgba1}, 0 0 30px ${colorRgba2}, 0 0 40px ${colorRgba3}`;
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
      
      // Set initial color (cyan) with enhanced glow
      particle.style.backgroundColor = '#00ffff';
      particle.style.boxShadow = '0 0 12px #00ffff, 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)';
      
      particleContainer!.appendChild(particle);
      
      // Give particle unique ID for trail tracking
      const particleId = `particle-${startTime}-${i}-${Math.random().toString(36).substr(2, 9)}`;
      particle.id = particleId;
      
      // Add particle to array
      particles.push({
        element: particle,
        x,
        y,
        velocityX,
        velocityY,
        startTime,
        duration: DURATION,
        gravityStartTime: GRAVITY_START_TIME,
        trail: [],
        lastTrailTime: startTime
      });
    }
  });
  
  // Start animation loop if not already running
  startAnimationLoop();
}
