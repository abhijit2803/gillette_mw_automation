/**
 * Page Manager - Centralized Page Object Management
 * Creates and manages all page objects with shared utilities
 * 
 * Usage:
 * import { PageManager } from '../utils/PageManager.js';
 * const pageManager = new PageManager(page);
 * const homePage = pageManager.onHomePage();
 */

// Note: Uncomment imports as page objects are created
// import { helperBase } from '../pages/helperBase.js';
import { homePage } from '../pages/homePage.js';
// import { accountPopupPage } from '../pages/accountPopupPage.js';
// import { loginPage } from '../pages/loginPage.js';
// import { profilePage } from '../pages/profilePage.js';

/**
 * Page Manager - Helper class to create and initialize all page objects
 */
export class pageManager {
  constructor(page) {
    this.page = page;

    // Initialize all page objects as data members
    // Note: Uncomment as page objects are created
    // this.basePage = new helperBase(this.page);
    this.homePage = new homePage(this.page);
    // this.accountPopupPage = new accountPopupPage(this.page);
    // this.loginPage = new loginPage(this.page);
    // this.profilePage = new profilePage(this.page);
  }

  /**
   * Get BasePage instance
   * @returns {helperBase}
   */
  onBasePage() {
    return this.basePage;
  }

  /**
   * Get HomePage instance
   * @returns {homePage}
   */
  onHomePage() {
    return this.homePage;
  }

  /**
   * Get AccountPopupPage instance
   * @returns {accountPopupPage}
   */
  onAccountPopupPage() {
    return this.accountPopupPage;
  }

  /**
   * Get LoginPage instance
   * @returns {loginPage}
   */
  onLoginPage() {
    return this.loginPage;
  }

  /**
   * Get ProfilePage instance
   * @returns {profilePage}
   */
  onProfilePage() {
    return this.profilePage;
  }

}

/**
 * Default export - PageManager for convenient use
 */
export default pageManager;