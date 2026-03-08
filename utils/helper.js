/**
 * Helper Utilities
 * Common utility functions for test automation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 * @param {string} domain - Email domain
 * @returns {string} Random email
 */
export function generateRandomEmail(domain = 'example.com') {
  const randomString = generateRandomString(8);
  return `test_${randomString}@${domain}`;
}

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the wait
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get laptop-friendly viewport sizes
 * @returns {Object} Object containing different laptop viewport presets
 */
export function getLaptopViewports() {
  return {
    // Standard laptop (most common - fits most laptop screens)
    standard: { width: 1366, height: 768 },
    
    // Small laptop/netbook
    small: { width: 1280, height: 720 },
    
    // Large laptop
    large: { width: 1440, height: 900 },
    
    // Full HD laptop (may go beyond some screens)
    fullHD: { width: 1920, height: 1080 },
    
    // MacBook Air
    macBookAir: { width: 1440, height: 900 },
    
    // MacBook Pro
    macBookPro: { width: 1680, height: 1050 }
  };
}

/**
 * Get recommended viewport size for current system
 * @returns {Object} Recommended viewport size { width, height }
 */
export function getRecommendedViewport() {
  // Default to standard laptop size - fits most screens comfortably
  return getLaptopViewports().standard;
}

/**
 * Format date to string
 * @param {Date} date - Date object
 * @param {string} format - Format string (YYYY-MM-DD, DD/MM/YYYY, etc.)
 * @returns {string} Formatted date string
 */
export function formatDate(date = new Date(), format = 'YYYY-MM-DD') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Get current timestamp
 * @returns {string} Timestamp string
 */
export function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export function validatePassword(password) {
  const result = {
    score: 0,
    feedback: [],
    isValid: false
  };

  if (password.length >= 8) {
    result.score += 1;
  } else {
    result.feedback.push('Password must be at least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain lowercase letter');
  }

  if (/\d/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain number');
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.score += 1;
  } else {
    result.feedback.push('Password must contain special character');
  }

  result.isValid = result.score >= 4;
  return result;
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Promise that resolves with function result
 */
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await wait(delay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}

/**
 * Sanitize string for file names
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeFileName(str) {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * Get screenshot file name with timestamp
 * @param {string} testName - Test name
 * @param {string} step - Test step
 * @returns {string} Screenshot file name
 */
export function getScreenshotFileName(testName, step = 'screenshot') {
  const sanitizedTestName = sanitizeFileName(testName);
  const timestamp = getTimestamp();
  return `${sanitizedTestName}-${step}-${timestamp}.png`;
}

/**
 * Get baseURL from environmentConfig.json based on environment
 * @param {string} environment - Environment name (dev, qa, prod)
 * @returns {string} Base URL for the environment
 */
export function getBaseUrlForEnvironment(environment) {
  try {
    // Get the environmentConfig.json file path
    const envConfigPath = path.join(__dirname, '..', 'test-data', 'environmentConfig.json');
    
    // Read and parse the JSON file
    const environmentData = JSON.parse(fs.readFileSync(envConfigPath, 'utf-8'));
    
    // Get the baseUrl for the specified environment
    const baseUrl = environmentData.environments?.[environment]?.baseUrl;
    
    if (!baseUrl) {
      throw new Error(`BaseURL not found for environment: ${environment}`);
    }
    
    return baseUrl;
    
  } catch (error) {
    console.error(`Error reading baseURL from environmentConfig.json: ${error.message}`);
    throw new Error(`Failed to get baseURL for environment '${environment}': ${error.message}`);
  }
}

/**
 * Get environment name from current test context
 * @param {Object} testInfo - Playwright test info object
 * @returns {string} Environment name (prod, qa)
 */
export function getEnvironment(testInfo) {
  const projectName = testInfo.project.name || '';
  
  if (projectName.includes('Stage')) {
    return 'qa';
  } else if (projectName.includes('Prod')) {
    return 'prod';
  } else {
    return 'prod'; // default
  }
}



/**
 * Get random item from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random item from array
 */
export function getRandomItem(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get current year minus specified years
 * @param {number} years - Number of years to subtract from current year
 * @returns {number} Year value
 */
export function getYearMinusYears(years = 22) {
  return new Date().getFullYear() - years;
}