/**
 * Page Manager - Centralized Page Object Management
 * Creates and manages all page objects with shared utilities
 * 
 * Usage:
 * import { PageManager } from '../utils/PageManager.js';
 * const pageManager = new PageManager(page);
 */

import { helperBase } from '../pages/helperBase.js';
import { articleListingPage } from '../pages/articleListingPage.js';
import { articleDetailsPage } from '../pages/ArticleDetailsPage.js';
import { productDetailsPage } from '../pages/productDetailsPage.js';
import { productListingPage } from '../pages/productListingPage.js';

/**
 * Page Manager - Helper class to create and initialize all page objects
 */
export class pageManager {
  constructor(page) {
    this.page = page;

    // Initialize page objects
    this.basePage = new helperBase(this.page);
    this.articleListingPage = new articleListingPage(this.page);
    this.articleDetailsPage = new articleDetailsPage(this.page);
    this.productDetailsPage = new productDetailsPage(this.page);
    this.productListingPage = new productListingPage(this.page);
  }

  /**
   * Get BasePage instance
   * @returns {helperBase}
   */
  onBasePage() {
    return this.basePage;
  }

  /**
   * Get ArticleListingPage instance
   * @returns {articleListingPage}
   */
  onArticleListingPage() {
    return this.articleListingPage;
  }

  /**
   * Get ArticleDetailsPage instance
   * @returns {articleDetailsPage}
   */
  onArticleDetailsPage() {
    return this.articleDetailsPage;
  }

  /**
   * Get ProductDetailsPage instance
   * @returns {productDetailsPage}
   */
  onProductDetailsPage() {
    return this.productDetailsPage;
  }

  /**
   * Get ProductListingPage instance (India PLP)
   * @returns {productListingPage}
   */
  onProductListingPage() {
    return this.productListingPage;
  }

}

/**
 * Default export - PageManager for convenient use
 */
export default pageManager;