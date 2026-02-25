/**
 * Encryption Utility for Secure Password Management
 * Uses Node.js crypto module for AES-256-CBC encryption
 */

import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
// In production, store this in environment variable or secure vault
const ENCRYPTION_KEY = crypto.scryptSync('P@ssw0rd!Secret#Key2024', 'salt', 32);
const IV_LENGTH = 16;

/**
 * Encrypt a password
 * @param {string} password - Plain text password to encrypt
 * @returns {string} Encrypted password in format: iv:encryptedData
 */
export function encryptPassword(password) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV and encrypted data combined (IV needed for decryption)
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt a password
 * @param {string} encryptedPassword - Encrypted password in format: iv:encryptedData
 * @returns {string} Decrypted plain text password
 */
export function decryptPassword(encryptedPassword) {
  try {
    const [ivHex, encrypted] = encryptedPassword.split(':');
    
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted password format');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Helper to test encryption/decryption
 * Run: node utils/encryption.js
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const testPassword = 'TestPassword@123';
  console.log('Original Password:', testPassword);
  
  const encrypted = encryptPassword(testPassword);
  console.log('Encrypted:', encrypted);
  
  const decrypted = decryptPassword(encrypted);
  console.log('Decrypted:', decrypted);
  
  console.log('Match:', testPassword === decrypted);
}
