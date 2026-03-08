/**
 * Write A Review Page Object Model
 * Handles all interactions with the Write A Review form
 * 
 * Sections:
 * - Product Information Display
 * - Star Ratings (Overall, Value, Quality)
 * - Recommendation
 * - Review Summary
 * - Review Description
 * - Media Upload (Photo and Video)
 * - Personal Information (Nickname, Date of Birth, Gender, Email, Location)
 * - Terms and Conditions
 * - Form Submission
 * - Success Message Validation
 */

import { helperBase } from './helperBase.js';
import { expect } from '@playwright/test';
import { SYMBOLS, log } from '../utils/logConstants.js';
import { generateRandomString } from '../utils/helper.js';

export class writeAReviewPage extends helperBase {
  constructor(page) {
    super(page);

    // Product Information
    this.productName = page.locator('h1').first();
    this.pageHeading = page.locator('h1, [class*="heading"], [class*="title"]').first();

    // ==================== Star Ratings ====================
    // Overall Rating Stars (5-star rating)
    this.overallStarRating = (starIndex) => 
      page.locator(`//*[@id="main-content"]/div/div/div[2]/div/form/div[1]/div[1]/div[2]/div[1]/div[2]/span[${starIndex}]`);
    
    // Value & Quality Rating
    this.valueRating = (starIndex) => 
      page.locator(`//*[@id="main-content"]/div/div/div[2]/div/form/div[1]/div[1]/div[2]/div[2]/div[2]/span[${starIndex}]/label`);
    
    this.qualityRating = (starIndex) => 
      page.locator(`//*[@id="main-content"]/div/div/div[2]/div/form/div[1]/div[1]/div[2]/div[3]/div[2]/span[${starIndex}]/label`);

    // ==================== Recommendation ====================
    this.recommendYesButton = page.locator(`//*[@id="main-content"]/div/div/div[2]/div/form/div[1]/div[2]/div/button[1]`);
    this.recommendNoButton = page.locator(`//*[@id="main-content"]/div/div/div[2]/div/form/div[1]/div[2]/div/button[2]`);

    // ==================== Review Text Fields ====================
    this.reviewSummaryField = page.locator('#summary');
    this.reviewDescriptionField = page.locator('#description');

    // ==================== Media Upload ====================
    this.photoUploadField = page.locator('input[type="file"][name="photo"]');
    this.uploadedPhotoImage = page.locator('//*[@id="main-content"]/div/div[2]/div[2]/div/form/div[1]/div[4]/div[1]/div[2]/img');
    
    this.videoUploadField = page.locator('#video');
    this.uploadedVideoElement = page.locator('//*[@id="main-content"]/div/div[2]/div[2]/div/form/div[1]/div[4]/div[2]/div[2]/video');

    // ==================== Personal Information ====================
    this.nicknameField = page.locator('#nickname');
    
    this.dobMonthDropdown = page.locator('#dobMonth');
    this.dobYearDropdown = page.locator('#dobYear');
    
    this.genderDropdown = page.locator('#Gender');
    this.emailField = page.locator('#email');
    this.locationField = page.locator('#location');

    // ==================== Terms and Conditions ====================
    this.termsCheckbox = page.locator('#termsAndConditions');
    this.termsLabel = page.locator('label[for="termsAndConditions"]');

    // ==================== Form Submission ====================
    this.submitButton = page.locator(`//*[@id="main-content"]/div/div[2]/div[2]/div/form/div[1]/div[8]/button/span[1]`);
    
    // ==================== Success Message & Confirmation ====================
    this.successMessage = page.locator(`//*[contains(text(), 'ÜBERARBEITUNG ERFOLGREICH ÜBERMITTELT')]`);
    this.successMessageContainer = page.locator('[class*="success"], [class*="confirmation"], [role="dialog"]').first();
    
    this.continueButton = page.locator(`//*[@id="main-content"]/div/div[2]/div[2]/div/form/div[2]/div/div/div/div/div[2]/div/a/span[1]`);

    // ==================== Constants ====================
    this.MONTH_NAMES = {
      1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
      7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
    };

    this.TEST_COUNTRIES = ['India', 'Brazil', 'Canada', 'Germany', 'Japan', 'Australia', 'France', 'Mexico', 'Italy'];
  }

  // ==================== Navigation & Validation ====================

  /**
   * Get product name from the review page
   * @returns {Promise<string>} Product name
   */
  async getProductName() {
    try {
      const name = await this.productName.textContent();
      log(SYMBOLS.SUCCESS, `Product name extracted: ${name}`);
      return name.trim();
    } catch (error) {
      log(SYMBOLS.ERROR, `Failed to extract product name: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate that we're on the correct product review page
   * @param {string} expectedProductName - Expected product name
   * @returns {Promise<{success: boolean, actualName: string}>}
   */
  async validateProductNameOnReviewPage(expectedProductName) {
    const actualName = await this.getProductName();
    const success = actualName === expectedProductName;

    if (success) {
      log(SYMBOLS.SUCCESS, `✅ Product name matches: ${actualName}`);
    } else {
      log(SYMBOLS.WARNING, `⚠️ Product name mismatch. Expected: ${expectedProductName}, Got: ${actualName}`);
    }

    return { success, actualName };
  }

  // ==================== Star Ratings ====================

  /**
   * Select overall star rating
   * @param {number} starIndex - Star index (1-5)
   */
  async selectOverallRating(starIndex = 5) {
    log(SYMBOLS.INFO, `Selecting overall star rating: ${starIndex} stars`);
    await this.overallStarRating(starIndex).click();
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Overall rating selected: ${starIndex} stars`);
  }

  /**
   * Select value rating
   * @param {number} starIndex - Star index (1-5)
   */
  async selectValueRating(starIndex = 5) {
    log(SYMBOLS.INFO, `Selecting value rating: ${starIndex} stars`);
    await this.valueRating(starIndex).click();
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Value rating selected: ${starIndex} stars`);
  }

  /**
   * Select quality rating
   * @param {number} starIndex - Star index (1-5)
   */
  async selectQualityRating(starIndex = 5) {
    log(SYMBOLS.INFO, `Selecting quality rating: ${starIndex} stars`);
    await this.qualityRating(starIndex).click();
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Quality rating selected: ${starIndex} stars`);
  }

  // ==================== Recommendation ====================

  /**
   * Select recommendation (Yes or No)
   * @param {boolean} recommend - True for Yes, False for No
   */
  async selectRecommendation(recommend = true) {
    log(SYMBOLS.INFO, `Setting recommendation to: ${recommend ? 'Yes' : 'No'}`);
    const button = recommend ? this.recommendYesButton : this.recommendNoButton;
    await button.click();
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Recommendation selected: ${recommend ? 'Yes' : 'No'}`);
  }

  // ==================== Review Text ====================

  /**
   * Enter review summary (max 50 characters)
   * @param {string} summary - Review summary text
   */
  async enterReviewSummary(summary) {
    if (summary.length > 50) {
      log(SYMBOLS.ERROR, `❌ Summary exceeds 50 character limit: ${summary.length} characters`);
      throw new Error(`Summary must be 50 characters or less. Got: ${summary.length}`);
    }

    log(SYMBOLS.INFO, `Entering review summary: "${summary}"`);
    await this.reviewSummaryField.fill(summary);
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Review summary entered (${summary.length}/50 characters): ${summary}`);
  }

  /**
   * Enter review description (50-200 characters)
   * @param {string} description - Review description text
   */
  async enterReviewDescription(description) {
    if (description.length < 50 || description.length > 200) {
      log(SYMBOLS.ERROR, `❌ Description must be 50-200 characters: ${description.length} characters`);
      throw new Error(`Description must be 50-200 characters. Got: ${description.length}`);
    }

    log(SYMBOLS.INFO, `Entering review description: "${description}"`);
    await this.reviewDescriptionField.fill(description);
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Review description entered (${description.length}/200 characters)`);
  }

  // ==================== Media Upload ====================

  /**
   * Upload photo
   * @param {string} filePath - Full path to photo file
   */
  async uploadPhoto(filePath) {
    log(SYMBOLS.INFO, `Uploading photo: ${filePath}`);
    await this.photoUploadField.setInputFiles(filePath);
    
    // Wait for photo to be processed and image element to appear
    try {
      await this.uploadedPhotoImage.waitFor({ state: 'visible', timeout: 10000 });
      log(SYMBOLS.SUCCESS, `✅ Photo uploaded successfully`);
    } catch (error) {
      log(SYMBOLS.WARNING, `⚠️ Photo upload completed but image not visible immediately`);
    }
    
    await this.page.waitForTimeout(2000);
  }

  /**
   * Upload video
   * @param {string} filePath - Full path to video file
   */
  async uploadVideo(filePath) {
    log(SYMBOLS.INFO, `Uploading video: ${filePath}`);
    await this.videoUploadField.setInputFiles(filePath);
    
    // Wait for video to be processed
    try {
      await this.uploadedVideoElement.waitFor({ state: 'visible', timeout: 10000 });
      log(SYMBOLS.SUCCESS, `✅ Video uploaded successfully`);
    } catch (error) {
      log(SYMBOLS.WARNING, `⚠️ Video upload completed but element not visible immediately`);
    }
    
    await this.page.waitForTimeout(2000);
  }

  // ==================== Personal Information ====================

  /**
   * Enter nickname (4-20 characters)
   * @param {string} nickname - Nickname text
   */
  async enterNickname(nickname) {
    if (nickname.length < 4 || nickname.length > 20) {
      throw new Error(`Nickname must be 4-20 characters. Got: ${nickname.length}`);
    }

    log(SYMBOLS.INFO, `Entering nickname: "${nickname}"`);
    await this.nicknameField.fill(nickname);
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Nickname entered: ${nickname}`);
  }

  /**
   * Generate and enter random nickname
   * @returns {Promise<string>} Generated nickname
   */
  async generateAndEnterNickname() {
    const nickname = generateRandomString(8);
    await this.enterNickname(nickname);
    log(SYMBOLS.SUCCESS, `✅ Random nickname generated and entered: ${nickname}`);
    return nickname;
  }

  /**
   * Select birth month
   * @param {number} monthIndex - Month index (1-12)
   */
  async selectBirthMonth(monthIndex = null) {
    if (monthIndex === null) {
      monthIndex = Math.floor(Math.random() * 12) + 1;
    }

    log(SYMBOLS.INFO, `Selecting birth month: ${this.MONTH_NAMES[monthIndex]} (index: ${monthIndex})`);
    const select = this.page.locator('#dobMonth');
    
    // Wait for dropdown to be visible first
    await select.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
    
    // Click to open dropdown
    await select.click();
    await this.page.waitForTimeout(1000);
    
    // Use selectOption with the value as string (month values are typically 1-12 or 0-11)
    try {
      // Try selecting by value (string of the monthIndex)
      await select.selectOption(String(monthIndex));
    } catch (error) {
      // Fallback: try by index (0-based)
      log(SYMBOLS.WARNING, `Could not select month by value, trying by index`);
      await select.selectOption({ index: monthIndex });
    }
    
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Birth month selected: ${this.MONTH_NAMES[monthIndex]}`);
    return monthIndex;
  }

  /**
   * Select birth year (minimum age: 22 years)
   * @param {number} year - Year to select (optional, defaults to current year - 22)
   */
  async selectBirthYear(year = null) {
    if (year === null) {
      const currentYear = new Date().getFullYear();
      year = currentYear - 22;
    }

    log(SYMBOLS.INFO, `Selecting birth year: ${year}`);
    const select = this.page.locator('#dobYear');
    await select.click();
    await this.page.waitForTimeout(1000);
    
    try {
      await select.selectOption(String(year));
    } catch (error) {
      log(SYMBOLS.WARNING, `Could not select year by value, trying by visible text`);
      await select.selectOption({ label: String(year) });
    }
    
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Birth year selected: ${year}`);
    return year;
  }

  /**
   * Select gender
   * @param {string} gender - Gender to select (optional, defaults to random)
   */
  async selectGender(gender = null) {
    log(SYMBOLS.INFO, `Selecting gender: ${gender || 'random'}`);
    const select = this.page.locator('#Gender');
    await select.click();
    await this.page.waitForTimeout(1000);
    
    if (gender) {
      try {
        await select.selectOption(gender);
      } catch (error) {
        log(SYMBOLS.WARNING, `Could not select gender by value, trying by label`);
        await select.selectOption({ label: gender });
      }
    } else {
      const options = await select.locator('option').all();
      const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1; // Skip first option (placeholder)
      const selectedText = await options[randomIndex].textContent();
      await select.selectOption({ index: randomIndex });
      log(SYMBOLS.SUCCESS, `✅ Random gender selected: ${selectedText}`);
    }
    
    await this.page.waitForTimeout(2000);
  }

  /**
   * Enter email address
   * @param {string} email - Email address
   */
  async enterEmail(email) {
    log(SYMBOLS.INFO, `Entering email: ${email}`);
    await this.emailField.fill(email);
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Email entered: ${email}`);
  }

  /**
   * Generate and enter random email
   * @returns {Promise<string>} Generated email
   */
  async generateAndEnterEmail() {
    const email = generateRandomString(8) + '@gmail.com';
    await this.enterEmail(email);
    return email;
  }

  /**
   * Enter location/country
   * @param {string} location - Country/location name
   */
  async enterLocation(location) {
    log(SYMBOLS.INFO, `Entering location: ${location}`);
    await this.locationField.fill(location);
    await this.page.waitForTimeout(2000);
    log(SYMBOLS.SUCCESS, `✅ Location entered: ${location}`);
  }

  /**
   * Select random location from predefined list
   * @returns {Promise<string>} Selected location
   */
  async selectRandomLocation() {
    const location = this.TEST_COUNTRIES[Math.floor(Math.random() * this.TEST_COUNTRIES.length)];
    await this.enterLocation(location);
    return location;
  }

  // ==================== Terms and Conditions ====================

  /**
   * Accept terms and conditions
   */
  async acceptTermsAndConditions() {
    log(SYMBOLS.INFO, 'Accepting terms and conditions...');
    
    const isChecked = await this.termsCheckbox.isChecked();
    if (!isChecked) {
      await this.termsCheckbox.click();
      await this.page.waitForTimeout(2000);
    }
    
    log(SYMBOLS.SUCCESS, '✅ Terms and conditions accepted');
  }

  // ==================== Form Submission ====================

  /**
   * Submit the review form
   */
  async submitReview() {
    log(SYMBOLS.INFO, 'Submitting review form...');
    await this.submitButton.click();
    await this.page.waitForTimeout(5000);
    log(SYMBOLS.SUCCESS, '✅ Review form submitted');
  }

  /**
   * Verify success message appears
   * @param {string} expectedMessage - Expected success message
   * @returns {Promise<{success: boolean, actualMessage: string}>}
   */
  async verifySuccessMessage(expectedMessage = 'ÜBERARBEITUNG ERFOLGREICH ÜBERMITTELT') {
    log(SYMBOLS.INFO, 'Verifying success message...');
    
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
      const actualMessage = await this.successMessage.textContent();
      const success = actualMessage?.trim() === expectedMessage.trim();

      if (success) {
        log(SYMBOLS.SUCCESS, `✅ Success message verified: ${actualMessage}`);
      } else {
        log(SYMBOLS.WARNING, `⚠️ Success message mismatch. Expected: "${expectedMessage}", Got: "${actualMessage}"`);
      }

      return { success, actualMessage: actualMessage?.trim() || '' };
    } catch (error) {
      log(SYMBOLS.ERROR, `❌ Success message not found: ${error.message}`);
      return { success: false, actualMessage: '' };
    }
  }

  // ==================== Return to Product Page ====================

  /**
   * Click continue button to return to product page
   */
  async clickContinue() {
    log(SYMBOLS.INFO, 'Clicking continue button to return to product page...');
    await this.continueButton.click();
    await this.page.waitForTimeout(5000);
    log(SYMBOLS.SUCCESS, '✅ Continue button clicked');
  }

  /**
   * Verify return to product page
   * @param {string} expectedProductUrl - Expected product page URL
   * @returns {Promise<{success: boolean, currentUrl: string}>}
   */
  async verifyReturnToProductPage(expectedProductUrl) {
    const currentUrl = this.page.url();
    const success = currentUrl === expectedProductUrl;

    if (success) {
      log(SYMBOLS.SUCCESS, `✅ Returned to correct product page: ${currentUrl}`);
    } else {
      log(SYMBOLS.WARNING, `⚠️ URL mismatch. Expected: ${expectedProductUrl}, Got: ${currentUrl}`);
    }

    return { success, currentUrl };
  }

  // ==================== Complete Form Submission Workflow ====================

  /**
   * Complete entire review form with default test data
   * @param {Object} options - Configuration options
   * @returns {Promise<{summary: string, description: string, nickname: string, email: string, location: string}>}
   */
  async completeReviewFormWithDefaults(options = {}) {
    const config = {
      overallRating: options.overallRating || 5,
      valueRating: options.valueRating || 5,
      qualityRating: options.qualityRating || 5,
      recommend: options.recommend !== false,
      summary: options.summary || 'Dieses Produkt ist das Beste von Gillette',
      description: options.description || 'Der GilletteLabs übertrifft alles was bisher Gillette entwickelt und auf den Markt gebracht hat. Das Rasieren ist noch angenehmer: zwick nicht, sanft, keine Hautirritation.',
      photoPath: options.photoPath,
      videoPath: options.videoPath,
      nickname: options.nickname,
      monthIndex: options.monthIndex,
      year: options.year,
      gender: options.gender,
      email: options.email,
      location: options.location
    };

    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');
    log(SYMBOLS.ROCKET, 'FILLING REVIEW FORM WITH TEST DATA');
    log(SYMBOLS.ROCKET, '═══════════════════════════════════════════════════════════');

    // Star ratings
    await this.selectOverallRating(config.overallRating);
    await this.selectValueRating(config.valueRating);
    await this.selectQualityRating(config.qualityRating);

    // Recommendation
    await this.selectRecommendation(config.recommend);

    // Review text
    await this.enterReviewSummary(config.summary);
    await this.enterReviewDescription(config.description);

    // Media (optional)
    if (config.photoPath) {
      await this.uploadPhoto(config.photoPath);
    }
    if (config.videoPath) {
      await this.uploadVideo(config.videoPath);
    }

    // Personal information
    const nickname = config.nickname || (await this.generateAndEnterNickname());
    const monthIndex = config.monthIndex || (await this.selectBirthMonth());
    const year = config.year || (await this.selectBirthYear());
    await this.selectGender(config.gender);
    const email = config.email || (await this.generateAndEnterEmail());
    const location = config.location || (await this.selectRandomLocation());

    // Terms and conditions
    await this.acceptTermsAndConditions();

    log(SYMBOLS.SUCCESS, '✅ Review form completed');

    return {
      summary: config.summary,
      description: config.description,
      nickname,
      email,
      location,
      monthIndex,
      year
    };
  }
}
