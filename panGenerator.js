// panGenerator.js - Utility functions for generating valid test data

/**
 * Generate a valid PAN number (Permanent Account Number)
 * Format: AAAAA9999A
 * - First 5 chars: Letters (A-Z)
 * - Next 4 chars: Digits (0-9)
 * - Last char: Letter (A-Z)
 */
export function generatePAN() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let pan = '';
  
  // First 5 letters
  for (let i = 0; i < 5; i++) {
    pan += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Next 4 digits
  for (let i = 0; i < 4; i++) {
    pan += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  // Last letter
  pan += letters.charAt(Math.floor(Math.random() * letters.length));
  
  return pan;
}

/**
 * Generate a random full name
 */
export function generateName() {
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Neha', 'Arjun', 'Sneha', 'Vikram', 'Ananya', 'Ravi', 'Pooja'];
  const lastNames = ['Singh', 'Kumar', 'Sharma', 'Patel', 'Verma', 'Gupta', 'Reddy', 'Nair', 'Bhatt', 'Iyer'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}