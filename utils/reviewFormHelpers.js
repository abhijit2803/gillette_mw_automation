/**
 * Helper utilities for Gillette Review Form tests
 */

class ReviewFormHelpers {
  /**
   * Calculate age from birth date
   * @param {number} birthYear - Birth year
   * @param {number} birthMonth - Birth month (1-12)
   * @returns {number} Age in years
   */
  static calculateAge(birthYear, birthMonth) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    let age = currentYear - birthYear;
    
    if (currentMonth < birthMonth) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if user meets minimum age requirement
   * @param {number} birthYear - Birth year
   * @param {number} birthMonth - Birth month (1-12)
   * @param {number} minAge - Minimum required age (default: 18)
   * @returns {boolean} True if meets age requirement
   */
  static meetsAgeRequirement(birthYear, birthMonth, minAge = 18) {
    const age = this.calculateAge(birthYear, birthMonth);
    return age >= minAge;
  }

  /**
   * Generate random German name
   * @returns {string} Random German name
   */
  static generateRandomGermanName() {
    const firstNames = ['Max', 'Hans', 'Klaus', 'Werner', 'Stefan', 'Michael', 'Thomas', 'Andreas'];
    const lastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName}${lastName}`;
  }

  /**
   * Generate random email address
   * @param {string} domain - Email domain (default: example.com)
   * @returns {string} Random email address
   */
  static generateRandomEmail(domain = 'example.com') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test${timestamp}${random}@${domain}`;
  }

  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate German lorem ipsum text
   * @param {number} wordCount - Number of words to generate
   * @returns {string} Generated text
   */
  static generateGermanText(wordCount) {
    const words = [
      'der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich',
      'des', 'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als',
      'auch', 'es', 'an', 'werden', 'aus', 'er', 'hat', 'dass', 'sie', 'nach',
      'wird', 'bei', 'einer', 'um', 'am', 'sind', 'noch', 'wie', 'einem', 'über',
      'einen', 'so', 'zum', 'war', 'haben', 'nur', 'oder', 'aber', 'vor', 'zur',
      'Rasierer', 'Haut', 'Rasur', 'Qualität', 'Produkt', 'sehr', 'gut', 'empfindlich'
    ];
    
    let text = '';
    for (let i = 0; i < wordCount; i++) {
      text += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    
    return text.trim();
  }

  /**
   * Generate review summary
   * @returns {string} Review summary
   */
  static generateReviewSummary() {
    const summaries = [
      'Hervorragender Rasierer für empfindliche Haut',
      'Sehr gute Qualität und schonende Rasur',
      'Top Produkt mit innovativer Technologie',
      'Empfehlenswert für alle Hauttypen',
      'Ausgezeichnetes Preis-Leistungs-Verhältnis',
      'Beste Rasur seit langem',
      'Perfekt für sensible Haut',
      'Überzeugende Leistung und Komfort'
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  /**
   * Generate review text
   * @param {boolean} positive - Whether review is positive (default: true)
   * @returns {string} Review text
   */
  static generateReviewText(positive = true) {
    if (positive) {
      const positiveReviews = [
        'Ich benutze diesen Rasierer seit drei Monaten und bin sehr zufrieden. Die SkinGuard-Technologie funktioniert wirklich gut und meine Haut ist viel weniger gereizt. Die FlexBall-Funktion macht es einfach, schwierige Stellen zu erreichen. Würde ich definitiv weiterempfehlen!',
        'Dieser Rasierer hat meine Erwartungen übertroffen. Die Rasur ist gründlich und trotzdem sehr sanft zur Haut. Besonders für empfindliche Haut ist er perfekt geeignet. Die Verarbeitung ist hochwertig und das Design ist ergonomisch.',
        'Nach langem Ausprobieren verschiedener Rasierer habe ich endlich den richtigen gefunden. Die innovative Technologie sorgt für eine hautschonende Rasur ohne Irritationen. Das Produkt hält was es verspricht und ist jeden Euro wert.'
      ];
      return positiveReviews[Math.floor(Math.random() * positiveReviews.length)];
    } else {
      const negativeReviews = [
        'Leider hat der Rasierer bei mir nicht die gewünschten Ergebnisse erzielt. Die Rasur war nicht so gründlich wie erhofft und die Handhabung könnte besser sein. Vielleicht funktioniert er bei anderen besser.',
        'Das Produkt entspricht nicht meinen Erwartungen. Die Rasur ist okay, aber nicht überragend. Für den Preis hätte ich mehr erwartet. Es gibt sicher bessere Alternativen auf dem Markt.'
      ];
      return negativeReviews[Math.floor(Math.random() * negativeReviews.length)];
    }
  }

  /**
   * Wait for specified duration
   * @param {number} ms - Milliseconds to wait
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current date in German format
   * @returns {string} Date in DD.MM.YYYY format
   */
  static getCurrentDateGerman() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    return `${day}.${month}.${year}`;
  }

  /**
   * Generate test file path for image upload
   * @returns {string} Path to test image
   */
  static getTestImagePath() {
    // Assuming test images are stored in test-data/images/
    return './test-data/images/test-product.jpg';
  }

  /**
   * Generate test file path for video upload
   * @returns {string} Path to test video
   */
  static getTestVideoPath() {
    // Assuming test videos are stored in test-data/videos/
    return './test-data/videos/test-review.mp4';
  }

  /**
   * Sanitize text for XSS testing
   * @param {string} text - Text to check
   * @returns {boolean} True if text contains potential XSS
   */
  static containsXSS(text) {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /<iframe/i,
      /eval\(/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Generate unique test identifier
   * @returns {string} Unique identifier
   */
  static generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log test data for debugging
   * @param {Object} data - Data to log
   * @param {string} label - Log label
   */
  static logTestData(data, label = 'Test Data') {
    console.log(`\n=== ${label} ===`);
    console.log(JSON.stringify(data, null, 2));
    console.log('='.repeat(label.length + 8) + '\n');
  }

  /**
   * Take screenshot with timestamp
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   */
  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-results/screenshots/${name}_${timestamp}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Screenshot saved: ${filename}`);
  }

  /**
   * Get German month name
   * @param {number} monthNumber - Month number (1-12)
   * @returns {string} German month name
   */
  static getGermanMonthName(monthNumber) {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months[monthNumber - 1] || '';
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Initial delay in ms
   */
  static async retry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.wait(delay * Math.pow(2, i));
      }
    }
  }
}

export default ReviewFormHelpers;
