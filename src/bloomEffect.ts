/**
 * Creates a bloom emission effect with cyan dots that transition to purple
 * @param element - The element to emit particles from
 * @param count - Number of particles to create (default: 25)
 */
export function createBloomEffect(element: HTMLElement, count: number = 25): void {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Create container for particles if it doesn't exist
  let particleContainer = document.getElementById('bloom-particles');
  if (!particleContainer) {
    particleContainer = document.createElement('div');
    particleContainer.id = 'bloom-particles';
    particleContainer.className = 'bloom-particles-container';
    document.body.appendChild(particleContainer);
  }
  
  // Create particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'bloom-particle';
    
    // Random angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100; // 50-150px
    const duration = 1000 + Math.random() * 500; // 1-1.5s
    
    // Calculate end position
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    // Set initial position (account for scroll)
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
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
}

