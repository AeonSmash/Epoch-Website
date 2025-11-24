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
  
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  // Emit particles from each active dot
  activeDots.forEach((dot) => {
    const rect = dot.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create particles for this dot
    for (let i = 0; i < particlesPerDot; i++) {
      const particle = document.createElement('div');
      particle.className = 'bloom-particle';
      
      // Random angle and distance
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100; // 50-150px (increased for longer travel)
      const duration = 2500 + Math.random() * 1000; // 2.5-3.5s (longer duration)
      
      // Calculate end position
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;
      
      // Set initial position (account for scroll)
      particle.style.left = `${centerX + scrollX}px`;
      particle.style.top = `${centerY + scrollY}px`;
      
      // Calculate transform values
      const translateX = endX - centerX;
      const translateY = endY - centerY;
      
      // Set initial color
      particle.style.backgroundColor = '#00ffff';
      particle.style.boxShadow = '0 0 4px #00ffff';
      
      // Create animation for transform and opacity
      const animation = particle.animate([
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${translateX}px, ${translateY}px) scale(0.5)`,
          opacity: 0
        }
      ], {
        duration: duration,
        easing: 'ease-out',
        fill: 'forwards'
      });
      
      // Animate color separately with three color transitions
      // Transition 1: Cyan → Blue (0-33%)
      // Transition 2: Blue → Purple (33-66%)
      // Transition 3: Purple → Magenta (66-100%)
      const startTime = performance.now();
      const animateColor = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
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
        
        if (progress < 1) {
          requestAnimationFrame(animateColor);
        }
      };
      requestAnimationFrame(animateColor);
      
      particleContainer.appendChild(particle);
      
      // Remove particle after animation completes
      animation.addEventListener('finish', () => {
        particle.remove();
      });
    }
  });
}

