/**
 * Password Encryption Helper Script
 * 
 * This script helps you encrypt passwords for use in test-data/users.json
 * 
 * Usage:
 *   node scripts/encryptPassword.js
 * 
 * Or with command line argument:
 *   node scripts/encryptPassword.js "YourPassword123"
 */

import readline from 'readline';
import { encryptPassword, decryptPassword } from '../utils/encryption.js';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Check if password provided as command line argument
const passwordArg = process.argv[2];

if (passwordArg) {
  // Encrypt password from command line
  encryptAndDisplay(passwordArg);
} else {
  // Interactive mode
  interactiveMode();
}

/**
 * Encrypt password and display results
 */
function encryptAndDisplay(password) {
  console.log('');
  log(colors.blue, '═══════════════════════════════════════════════════');
  log(colors.blue, '         Password Encryption Utility');
  log(colors.blue, '═══════════════════════════════════════════════════');
  console.log('');
  
  try {
    const encrypted = encryptPassword(password);
    
    log(colors.green, '✓ Password encrypted successfully!');
    console.log('');
    log(colors.yellow, 'Encrypted Password (copy this):');
    log(colors.green, `encrypted:${encrypted}`);
    console.log('');
    
    // Verify by decrypting
    const decrypted = decryptPassword(encrypted);
    const match = decrypted === password;
    
    if (match) {
      log(colors.green, '✓ Verification successful - encryption/decryption working correctly');
    } else {
      log(colors.red, '✗ Verification failed - please try again');
    }
    
    console.log('');
    log(colors.blue, '───────────────────────────────────────────────────');
    log(colors.yellow, 'How to use:');
    console.log('');
    console.log('1. Copy the encrypted password above (including "encrypted:" prefix)');
    console.log('2. Open test-data/users.json');
    console.log('3. Update the password field:');
    console.log('');
    console.log('   "gillette-dev": {');
    console.log('     "username": "your-username",');
    log(colors.green, `     "password": "encrypted:${encrypted}",`);
    console.log('     "pingId": "your-ping-id",');
    console.log('     "isEncrypted": true');
    console.log('   }');
    console.log('');
    log(colors.blue, '═══════════════════════════════════════════════════');
    console.log('');
    
  } catch (error) {
    log(colors.red, `✗ Encryption failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Interactive mode for password encryption
 */
function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('');
  log(colors.blue, '═══════════════════════════════════════════════════');
  log(colors.blue, '         Password Encryption Utility');
  log(colors.blue, '═══════════════════════════════════════════════════');
  console.log('');
  log(colors.yellow, 'This tool will encrypt your password for secure storage.');
  console.log('');
  
  // Hide password input
  rl.question('Enter password to encrypt: ', (password) => {
    rl.close();
    
    if (!password || password.trim() === '') {
      log(colors.red, '✗ Password cannot be empty');
      process.exit(1);
    }
    
    encryptAndDisplay(password.trim());
  });
  
  // Note: In production, you might want to use a library like 'read'
  // to hide password input. For now, this is a simple implementation.
  console.log('');
  log(colors.yellow, 'Note: Your password will be visible as you type.');
  log(colors.yellow, 'For better security, use: node scripts/encryptPassword.js "YourPassword"');
  console.log('');
}
