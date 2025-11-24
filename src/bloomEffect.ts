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
      const initialSpeed = 20 + Math.random() * 30; // 20-50px/s initial speed
      let velocityX = Math.cos(angle) * initialSpeed;
      let velocityY = Math.sin(angle) * initialSpeed;
      
      // Gravity constant (pixels per second squared)
      const gravity = 200; // 200px/s²
      
      // Duration: 10 seconds
      const duration = 10000; // 10 seconds
      
      // Set initial position (viewport coordinates since container is fixed)
      let x = centerX;
      let y = centerY;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Set initial color
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
        
        // Update velocity with gravity (only affects Y, in pixels per second)
        velocityY += gravity * deltaTime;
        
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
        
        // Update color with three transitions
        let r, g, b;
        
        if (progress < 0.33) {
          // Transition 1: Cyan to Blue
          const t = progress / 0.33;
          r = Math.round(0 + (30 * t));      // 0 → 30
          g = Math.round(255 + (100 * t));   // 255 → 155
          b = Math.round(255 + (25 * t));   // 255 → 230
        } else if (progress < 0.66) {
          // Transition 2: Blue to Purple
          const t = (progress - 0.33) / 0.33;
          r = Math.round(30 + (49 * t));    // 30 → 79
          g = Math.round(155 - (85 * t));    // 155 → 70
          b = Math.round(230 - (1 * t));     // 230 → 229
        } else {
          // Transition 3: Purple to Magenta
          const t = (progress - 0.66) / 0.34;
          r = Math.round(79 + (137 * t));    // 79 → 216
          g = Math.round(70 - (70 * t));     // 70 → 0
          b = Math.round(229 - (29 * t));     // 229 → 200
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

