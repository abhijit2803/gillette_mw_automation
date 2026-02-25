/**
 * Environment Configuration Helper
 * Manages test data loading from test-data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load test data from test-data
 * @param {string} filename - Name of the JSON file in test-data folder
 * @returns {Object} Parsed JSON data
 */
export function loadTestData(filename) {
  const filePath = path.join(__dirname, '..', 'test-data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

/**
 * Get test credentials for the current environment
 * @returns {{ email: string, password: string }} Test credentials
 */
export function getTestCredentials() {
  const users = loadTestData('users.json');
  return {
    email: process.env.TEST_EMAIL || users.testCredentials.default.email,
    password: process.env.TEST_PASSWORD || users.testCredentials.default.password
  };
}

/**
 * Get checkout test data for the current environment
 * @param {string} env - Environment name (dev, qa, prod)
 * @returns {Object} Checkout test data
 */
export function getCheckoutTestData(env = 'prod') {
  const checkoutData = loadTestData('checkout.json');
  
  // Return standardCheckout for all environments to ensure consistent data structure
  return checkoutData.checkoutScenarios.standardCheckout;
}

/**
 * Get all checkout data
 * @returns {Object} Complete checkout data object
 */
export function getAllCheckoutData() {
  return loadTestData('checkout.json');
}

/**
 * Get API URL for the current environment
 * @param {string} environment - Environment name (dev, qa, prod)
 * @returns {string} API URL
 */
export function getApiUrl(environment = 'prod') {
  try {
    const environmentData = loadTestData('environmentConfig.json');
    const apiUrl = environmentData.environments?.[environment]?.apiUrl;
    
    if (!apiUrl) {
      throw new Error(`API URL not found for environment: ${environment}`);
    }
    
    return process.env.API_URL || apiUrl;
  } catch (error) {
    console.error(`Error reading API URL from environmentConfig.json: ${error.message}`);
    throw new Error(`Failed to get API URL for environment '${environment}': ${error.message}`);
  }
}