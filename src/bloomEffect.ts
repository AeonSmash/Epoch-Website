/**
 * Creates a bloom emission effect with cyan dots that transition to purple
 * Particles explode from each active dot in the digit
 * @param activeDots - Array of active dot elements to emit particles from
 * @param particlesPerDot - Number of particles per dot (default: 6)
 */
export function createBloomEffect(activeDots: HTMLElement[], particlesPerDot: number = 6): void {
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
      
      // Initial velocity (explosion outward) - faster initial speed
      const angle = Math.random() * Math.PI * 2;
      const initialSpeed = 80 + Math.random() * 60; // 80-140px/s initial speed (much faster explosion)
      let velocityX = Math.cos(angle) * initialSpeed;
      let velocityY = Math.sin(angle) * initialSpeed;
      
      // Velocity damping factor (friction) - particles slow down over time
      const damping = 0.98; // Reduce velocity by 2% per frame (slows down gradually)
      
      // Gravity constant (pixels per second squared) - reduced for slower fall
      const gravity = 80; // 80px/s² (slower gravity)
      
      // Gravity start time: 2 seconds
      const gravityStartTime = 2000; // 2 seconds in milliseconds
      
      // Duration: 5 seconds
      const duration = 5000; // 5 seconds
      
      // Set initial position (viewport coordinates since container is fixed)
      let x = centerX;
      let y = centerY;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Set initial color (cyan)
      particle.style.backgroundColor = '#00ffff';
      particle.style.boxShadow = '0 0 4px #00ffff';
      
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
        
        // Apply velocity damping (friction) - particles slow down over time
        // This makes them start fast and gradually slow down
        velocityX *= damping;
        velocityY *= damping;
        
        // Only apply gravity after 2 seconds have elapsed
        if (elapsed >= gravityStartTime) {
          // If particle is moving upward, slow it down more aggressively
          if (velocityY < 0) {
            // Additional damping for upward movement when gravity starts
            velocityY *= 0.9;
            // Once upward velocity is very small, set to zero so gravity can take over
            if (velocityY > -2) {
              velocityY = 0;
            }
          }
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
        
        // Update color with three transitions: Cyan → Blue → Purple → Red → Yellow
        let r, g, b;
        
        if (progress < 0.33) {
          // Transition 1: Blue to Purple
          const t = progress / 0.33;
          // Start from blue (0, 100, 255) → Purple (79, 70, 229)
          r = Math.round(0 + (79 * t));       // 0 → 79
          g = Math.round(100 - (30 * t));     // 100 → 70
          b = Math.round(255 - (26 * t));     // 255 → 229
        } else if (progress < 0.66) {
          // Transition 2: Purple to Red
          const t = (progress - 0.33) / 0.33;
          // Purple (79, 70, 229) → Red (255, 0, 0)
          r = Math.round(79 + (176 * t));     // 79 → 255
          g = Math.round(70 - (70 * t));      // 70 → 0
          b = Math.round(229 - (229 * t));    // 229 → 0
        } else {
          // Transition 3: Red to Yellow
          const t = (progress - 0.66) / 0.34;
          // Red (255, 0, 0) → Yellow (255, 255, 0)
          r = Math.round(255);                // 255 (stays)
          g = Math.round(0 + (255 * t));      // 0 → 255
          b = Math.round(0);                  // 0 (stays)
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

