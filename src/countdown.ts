import { renderDigitAsDots } from './dotMatrix';
import { createBloomEffect } from './bloomEffect';

const TARGET_DATE = new Date('2026-01-01T00:00:00Z');

interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

let previousValues: CountdownValues = {
  days: '',
  hours: '',
  minutes: '',
  seconds: ''
};

/**
 * Calculate time remaining until target date
 */
function calculateTimeRemaining(): CountdownValues {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
}

/**
 * Update a single digit and return active dots
 */
function updateDigit(
  container: HTMLElement,
  digit: number
): HTMLElement[] {
  const result = renderDigitAsDots(container, digit);
  return result.activeDots;
}

/**
 * Update the countdown display
 */
function updateCountdown(): void {
  const values = calculateTimeRemaining();
  
  // Get containers
  const daysContainer1 = document.getElementById('days-digit-1');
  const daysContainer2 = document.getElementById('days-digit-2');
  const daysGroup = document.getElementById('days-group');
  
  const hoursContainer1 = document.getElementById('hours-digit-1');
  const hoursContainer2 = document.getElementById('hours-digit-2');
  const hoursGroup = document.getElementById('hours-group');
  
  const minutesContainer1 = document.getElementById('minutes-digit-1');
  const minutesContainer2 = document.getElementById('minutes-digit-2');
  const minutesGroup = document.getElementById('minutes-group');
  
  const secondsContainer1 = document.getElementById('seconds-digit-1');
  const secondsContainer2 = document.getElementById('seconds-digit-2');
  const secondsGroup = document.getElementById('seconds-group');
  
  // Check if this is the first update
  const isFirstUpdate = !previousValues.days;
  
  // Collect all active dots from all digits
  let allDots: HTMLElement[] = [];
  
  // Update days and collect dots
  if (daysContainer1 && daysContainer2) {
    const days1 = parseInt(values.days[0]);
    const days2 = parseInt(values.days[1]);
    const dots1 = updateDigit(daysContainer1, days1);
    const dots2 = updateDigit(daysContainer2, days2);
    allDots = [...allDots, ...dots1, ...dots2];
  }
  
  // Update hours and collect dots
  if (hoursContainer1 && hoursContainer2) {
    const hours1 = parseInt(values.hours[0]);
    const hours2 = parseInt(values.hours[1]);
    const dots1 = updateDigit(hoursContainer1, hours1);
    const dots2 = updateDigit(hoursContainer2, hours2);
    allDots = [...allDots, ...dots1, ...dots2];
  }
  
  // Update minutes - check if minutes changed
  let minutesChanged = false;
  
  if (minutesContainer1 && minutesContainer2) {
    const minutes1 = parseInt(values.minutes[0]);
    const minutes2 = parseInt(values.minutes[1]);
    const prevMinutes1 = isFirstUpdate ? null : (previousValues.minutes ? parseInt(previousValues.minutes[0]) : null);
    const prevMinutes2 = isFirstUpdate ? null : (previousValues.minutes ? parseInt(previousValues.minutes[1]) : null);
    
    // Check if minutes changed
    if (!isFirstUpdate && (prevMinutes1 !== minutes1 || prevMinutes2 !== minutes2)) {
      minutesChanged = true;
    }
    
    // Update digits and collect active dots
    const dots1 = updateDigit(minutesContainer1, minutes1);
    const dots2 = updateDigit(minutesContainer2, minutes2);
    allDots = [...allDots, ...dots1, ...dots2];
  }
  
  // Update seconds and collect dots
  if (secondsContainer1 && secondsContainer2) {
    const seconds1 = parseInt(values.seconds[0]);
    const seconds2 = parseInt(values.seconds[1]);
    const dots1 = updateDigit(secondsContainer1, seconds1);
    const dots2 = updateDigit(secondsContainer2, seconds2);
    allDots = [...allDots, ...dots1, ...dots2];
  }
  
  // Trigger bloom effect from ALL dots when minutes change
  if (minutesChanged && allDots.length > 0) {
    createBloomEffect(allDots);
  }
  
  // Store current values for next comparison
  previousValues = values;
}

/**
 * Initialize the countdown timer
 */
export function initCountdown(): void {
  // Initial update
  updateCountdown();
  
  // Update every second
  setInterval(updateCountdown, 1000);
}

