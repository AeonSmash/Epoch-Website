/**
 * Creates a bloom emission effect with cyan dots that transition to purple
 * Particles explode from each active dot in the digit
 * @param activeDots - Array of active dot elements to emit particles from
 * @param particlesPerDot - Number of particles per dot (default: 3)
 */
export function createBloomEffect(activeDots: HTMLElement[], particlesPerDot: number = 3): void {
  // Create container for particles if it doesn't exist
  let particleContainer = document.getElementById('bloom-particles');
  if (!particleContainer) {
    particleContainer = document.createElement('div');
    particleContainer.id = 'bloom-particles';
    particleContainer.className = 'bloom-particles-container';
    document.body.appendChild(particleContainer);
  }
  
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
      const initialSpeed = 30 + Math.random() * 40; // 30-70px/s initial speed (increased for better explosion)
      let velocityX = Math.cos(angle) * initialSpeed;
      let velocityY = Math.sin(angle) * initialSpeed;
      
      // Gravity constant (pixels per second squared) - reduced for slower fall
      const gravity = 80; // 80px/s² (slower gravity)
      
      // Gravity start time: 5 seconds
      const gravityStartTime = 5000; // 5 seconds in milliseconds
      
      // Duration: 10 seconds
      const duration = 10000; // 10 seconds
      
      // Set initial position (viewport coordinates since container is fixed)
      let x = centerX;
      let y = centerY;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Set initial color (red)
      particle.style.backgroundColor = '#ff0000';
      particle.style.boxShadow = '0 0 4px #ff0000';
      
      particleContainer.appendChild(particle);
      
      // Physics-based animation with gravity
      const startTime = performance.now();
      let lastTime = startTime;
      let animationId: number;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (progress >= 1) {
          // Animation complete
          particle.remove();
          return;
        }
        
        // Calculate actual delta time (in seconds)
        const deltaTime = (currentTime - lastTime) / 1000; // Convert ms to seconds
        lastTime = currentTime;
        
        // Only apply gravity after 7 seconds have elapsed
        if (elapsed >= gravityStartTime) {
          // Update velocity with gravity (only affects Y, in pixels per second)
          velocityY += gravity * deltaTime;
        }
        
        // Update position (convert velocity from px/s to px/frame)
        x += velocityX * deltaTime;
        y += velocityY * deltaTime;
        
        // Update particle position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Update opacity (fade out over time)
        const opacity = 1 - progress;
        particle.style.opacity = opacity.toString();
        
        // Update scale (shrink over time)
        const scale = 1 - (progress * 0.5); // Scale from 1 to 0.5
        particle.style.transform = `scale(${scale})`;
        
        // Update color with three transitions: Red → Yellow → Purple
        let r, g, b;
        
        if (progress < 0.33) {
          // Transition 1: Red to Yellow
          const t = progress / 0.33;
          r = Math.round(255);                // 255 (red stays)
          g = Math.round(0 + (255 * t));      // 0 → 255
          b = Math.round(0);                  // 0 (stays)
        } else if (progress < 0.66) {
          // Transition 2: Yellow to Purple
          const t = (progress - 0.33) / 0.33;
          r = Math.round(255 - (176 * t));    // 255 → 79
          g = Math.round(255 - (185 * t));    // 255 → 70
          b = Math.round(0 + (229 * t));      // 0 → 229
        } else {
          // Transition 3: Purple (stays purple, slight fade)
          const t = (progress - 0.66) / 0.34;
          r = Math.round(79);                 // 79 (purple stays)
          g = Math.round(70);                 // 70 (purple stays)
          b = Math.round(229);                // 229 (purple stays)
        }
        
        const color = `rgb(${r}, ${g}, ${b})`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 4px ${color}`;
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    }
  });
}

