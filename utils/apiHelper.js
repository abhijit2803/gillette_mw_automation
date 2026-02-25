/**
 * API Helper Utilities
 * Helper functions for API testing and validation
 */

import { getTestCredentials, getApiUrl } from './dataProvider.js';

/**
 * Base API client class
 */
export class ApiClient {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || getApiUrl();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.authToken = null;
  }

  /**
   * Set authentication token
   * @param {string} token - Auth token
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Get request headers with auth token
   * @param {Object} additionalHeaders - Additional headers
   * @returns {Object} Complete headers object
   */
  getHeaders(additionalHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...additionalHeaders };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Make HTTP request
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response object
   */
  async request(method, endpoint, data = null, headers = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = this.getHeaders(headers);
    
    const options = {
      method,
      headers: requestHeaders
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json().catch(() => null);
      
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        ok: response.ok
      };
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response object
   */
  async get(endpoint, headers = {}) {
    return this.request('GET', endpoint, null, headers);
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response object
   */
  async post(endpoint, data, headers = {}) {
    return this.request('POST', endpoint, data, headers);
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response object
   */
  async put(endpoint, data, headers = {}) {
    return this.request('PUT', endpoint, data, headers);
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Additional headers
   * @returns {Promise<Object>} Response object
   */
  async delete(endpoint, headers = {}) {
    return this.request('DELETE', endpoint, null, headers);
  }
}

/**
 * Authentication API helper
 */
export class AuthApi extends ApiClient {
  /**
   * Login user and get auth token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   */
  async login(email = null, password = null) {
    const credentials = email && password 
      ? { email, password }
      : getTestCredentials();

    const response = await this.post('/auth/login', credentials);
    
    if (response.ok && response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    const response = await this.post('/auth/logout');
    
    if (response.ok) {
      this.authToken = null;
    }
    
    return response;
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} Profile response
   */
  async getProfile() {
    return this.get('/auth/profile');
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    return this.post('/auth/register', userData);
  }
}

/**
 * Products API helper
 */
export class ProductsApi extends ApiClient {
  /**
   * Get all products
   * @param {Object} filters - Product filters
   * @returns {Promise<Object>} Products response
   */
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/products${queryParams ? '?' + queryParams : ''}`;
    return this.get(endpoint);
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product response
   */
  async getProductById(productId) {
    return this.get(`/products/${productId}`);
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search response
   */
  async searchProducts(query, filters = {}) {
    const searchParams = { q: query, ...filters };
    const queryParams = new URLSearchParams(searchParams).toString();
    return this.get(`/products/search?${queryParams}`);
  }
}

/**
 * Cart API helper
 */
export class CartApi extends ApiClient {
  /**
   * Get user cart
   * @returns {Promise<Object>} Cart response
   */
  async getCart() {
    return this.get('/cart');
  }

  /**
   * Add item to cart
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity
   * @returns {Promise<Object>} Add to cart response
   */
  async addToCart(productId, quantity = 1) {
    return this.post('/cart/add', { productId, quantity });
  }

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   * @returns {Promise<Object>} Remove response
   */
  async removeFromCart(itemId) {
    return this.delete(`/cart/items/${itemId}`);
  }

  /**
   * Clear cart
   * @returns {Promise<Object>} Clear cart response
   */
  async clearCart() {
    return this.post('/cart/clear');
  }
}

/**
 * Validation helpers for API responses
 */
export class ApiValidator {
  /**
   * Validate response status
   * @param {Object} response - API response
   * @param {number} expectedStatus - Expected status code
   * @returns {boolean} True if status matches
   */
  static validateStatus(response, expectedStatus) {
    return response.status === expectedStatus;
  }

  /**
   * Validate response has required fields
   * @param {Object} responseData - Response data
   * @param {Array} requiredFields - Required field names
   * @returns {Object} Validation result
   */
  static validateRequiredFields(responseData, requiredFields) {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!(field in responseData)) {
        missingFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Validate response schema
   * @param {Object} responseData - Response data
   * @param {Object} schema - Expected schema
   * @returns {Object} Validation result
   */
  static validateSchema(responseData, schema) {
    // Basic schema validation - can be enhanced with libraries like Joi
    const errors = [];
    
    for (const [key, expectedType] of Object.entries(schema)) {
      if (key in responseData) {
        const actualType = typeof responseData[key];
        if (actualType !== expectedType) {
          errors.push(`${key}: expected ${expectedType}, got ${actualType}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export pre-configured API clients
export const authApi = new AuthApi();
export const productsApi = new ProductsApi();
export const cartApi = new CartApi();