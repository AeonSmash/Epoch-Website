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
      const distance = 30 + Math.random() * 70; // 30-100px
      const duration = 800 + Math.random() * 400; // 0.8-1.2s
      
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
      
      // Animate color separately using a color interpolation function
      const startTime = performance.now();
      const animateColor = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Interpolate from cyan to purple
        const r1 = 0, g1 = 255, b1 = 255; // Cyan
        const r2 = 79, g2 = 70, b2 = 229; // Purple
        
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        
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

