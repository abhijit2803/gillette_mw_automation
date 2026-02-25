/**
 * Constants for consistent logging symbols
 * Used across all test files for visual consistency
 */

// Test State Symbols - Single source of truth for all emojis
export const SYMBOLS = {
  // Test Flow
  ROCKET: '🚀',           // Test environment, project info
  HOME: '🏠',             // Home page actions
  CART: '🛒',             // Shopping cart actions
  SHOPPING: '🛍️',        // Shopping/purchase actions
  IMAGE: '🖼️',           // Image/visual elements
  SEARCH: '🔍',           // Search/verification actions
  DOCUMENT: '📝',         // Text/document content
  PAYMENT: '💳',          // Payment methods
  TARGET: '🎯',           // Order placement/targets
  EMAIL: '📧',            // Email actions
  SHIPPING: '🚚',         // Shipping actions
  ARROW_RIGHT: '➡️',      // Navigation/continue actions
  
  // Status Indicators
  SUCCESS: '✅',          // Success/passed
  WARNING: '⚠️',         // Warning/skipped
  ERROR: '❌',            // Error/failed
  INFO: 'ℹ️',             // Information
  
  // Content Types
  PACKAGE: '📦',          // Products/packages
  PAGE: '📄',             // Page titles/content
  MONEY: '💰',            // Pricing/totals
  CAMERA: '📸',           // Screenshots
  MESSAGE: '💌',          // Messages/notifications
  CURRENCY: '💵',         // Currency/money
  TAX: '🏛️',             // Tax/government
  CELEBRATION: '🎉',      // Celebration/completion
  CLIPBOARD: '📋',        // Order numbers/IDs
  
  // UI Elements
  CHECK: '✓',             // Simple checkmark
  X_MARK: '✗',            // Simple x mark
  BULLET: '•',            // Simple bullet point
  CONTINUE: '▶️',         // Continue/play actions
  CLOSE: '✖️',            // Close/exit actions
  
  // Additional symbols for comprehensive coverage
  ENV: '🌍',              // Environment
  PRODUCT: '🛍️',         // Product reference
  LINK: '🔗',             // URL/Link reference
};

/**
 * Universal logging function with symbol and message
 * @param {string} symbol - The symbol to use for logging
 * @param {string} message - The message to log
 */
export const log = (symbol, message) => {
  console.log(`${symbol} ${message}`);
};

// Export default for easier importing
export default { SYMBOLS, log };