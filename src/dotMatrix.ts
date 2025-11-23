// Dot Matrix Patterns for digits 0-9
// 5 columns x 7 rows = 35 dots per digit
// 1 = active dot (visible), 0 = inactive dot (transparent)

const DIGIT_PATTERNS: { [key: number]: number[] } = {
  0: [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1
  ],
  1: [
    0, 0, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 1, 0, 0,
    0, 1, 1, 1, 0
  ],
  2: [
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 1, 1, 1, 1
  ],
  3: [
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 1, 1, 1, 1
  ],
  4: [
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1
  ],
  5: [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 1, 1, 1, 1
  ],
  6: [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 0,
    1, 0, 0, 0, 0,
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1
  ],
  7: [
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 1, 0,
    0, 0, 1, 0, 0,
    0, 1, 0, 0, 0,
    1, 0, 0, 0, 0
  ],
  8: [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1
  ],
  9: [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 1,
    0, 0, 0, 0, 1,
    1, 1, 1, 1, 1
  ]
};

const COLS = 5;
const ROWS = 7;

/**
 * Renders a digit (0-9) as a dot matrix pattern
 * @param container - The container element to render the digit into
 * @param digit - The digit to render (0-9)
 * @returns The container element with the digit rendered
 */
export function renderDigitAsDots(container: HTMLElement, digit: number): HTMLElement {
  // Clear existing content
  container.innerHTML = '';
  container.className = 'digit-matrix';
  
  // Get pattern for this digit
  const pattern = DIGIT_PATTERNS[digit] || DIGIT_PATTERNS[0];
  
  // Create grid of dots
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;
      const isActive = pattern[index] === 1;
      
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (isActive) {
        dot.classList.add('dot-active');
      }
      container.appendChild(dot);
    }
  }
  
  return container;
}

