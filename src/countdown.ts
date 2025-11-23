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
 * Update a single digit and trigger bloom if it changed
 */
function updateDigit(
  container: HTMLElement,
  digit: number,
  previousDigit: number | null,
  parentContainer: HTMLElement
): void {
  renderDigitAsDots(container, digit);
  
  // Trigger bloom effect if digit changed
  if (previousDigit !== null && previousDigit !== digit) {
    createBloomEffect(parentContainer);
  }
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
  
  // Update days
  if (daysContainer1 && daysContainer2 && daysGroup) {
    const days1 = parseInt(values.days[0]);
    const days2 = parseInt(values.days[1]);
    const prevDays1 = isFirstUpdate ? null : (previousValues.days ? parseInt(previousValues.days[0]) : null);
    const prevDays2 = isFirstUpdate ? null : (previousValues.days ? parseInt(previousValues.days[1]) : null);
    
    updateDigit(daysContainer1, days1, prevDays1, daysGroup);
    updateDigit(daysContainer2, days2, prevDays2, daysGroup);
  }
  
  // Update hours
  if (hoursContainer1 && hoursContainer2 && hoursGroup) {
    const hours1 = parseInt(values.hours[0]);
    const hours2 = parseInt(values.hours[1]);
    const prevHours1 = isFirstUpdate ? null : (previousValues.hours ? parseInt(previousValues.hours[0]) : null);
    const prevHours2 = isFirstUpdate ? null : (previousValues.hours ? parseInt(previousValues.hours[1]) : null);
    
    updateDigit(hoursContainer1, hours1, prevHours1, hoursGroup);
    updateDigit(hoursContainer2, hours2, prevHours2, hoursGroup);
  }
  
  // Update minutes
  if (minutesContainer1 && minutesContainer2 && minutesGroup) {
    const minutes1 = parseInt(values.minutes[0]);
    const minutes2 = parseInt(values.minutes[1]);
    const prevMinutes1 = isFirstUpdate ? null : (previousValues.minutes ? parseInt(previousValues.minutes[0]) : null);
    const prevMinutes2 = isFirstUpdate ? null : (previousValues.minutes ? parseInt(previousValues.minutes[1]) : null);
    
    updateDigit(minutesContainer1, minutes1, prevMinutes1, minutesGroup);
    updateDigit(minutesContainer2, minutes2, prevMinutes2, minutesGroup);
  }
  
  // Update seconds
  if (secondsContainer1 && secondsContainer2 && secondsGroup) {
    const seconds1 = parseInt(values.seconds[0]);
    const seconds2 = parseInt(values.seconds[1]);
    const prevSeconds1 = isFirstUpdate ? null : (previousValues.seconds ? parseInt(previousValues.seconds[0]) : null);
    const prevSeconds2 = isFirstUpdate ? null : (previousValues.seconds ? parseInt(previousValues.seconds[1]) : null);
    
    updateDigit(secondsContainer1, seconds1, prevSeconds1, secondsGroup);
    updateDigit(secondsContainer2, seconds2, prevSeconds2, secondsGroup);
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

