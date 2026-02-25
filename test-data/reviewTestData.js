/**
 * Test Data Provider for Gillette Review Form
 * Contains valid, boundary, and invalid test data sets
 */

class ReviewTestData {
  /**
   * Get valid review data for successful form submission
   */
  static getValidReviewData() {
    return {
      overallRating: 4,
      productValue: 5,
      quality: 4,
      recommend: true,
      summary: 'Hervorragender Rasierer für empfindliche Haut',
      review: 'Ich benutze diesen Rasierer seit drei Monaten und bin sehr zufrieden. Die SkinGuard-Technologie funktioniert wirklich gut und meine Haut ist viel weniger gereizt. Die FlexBall-Funktion macht es einfach, schwierige Stellen zu erreichen. Würde ich definitiv weiterempfehlen!',
      nickname: 'MaxMustermann',
      birthMonth: '6',
      birthYear: '1985',
      gender: 'Männlich',
      email: 'max.mustermann@example.de',
      location: 'Berlin, Deutschland',
      marketingConsent: false
    };
  }

  /**
   * Get alternative valid review data (5 stars, negative recommendation)
   */
  static getAlternativeValidData() {
    return {
      overallRating: 5,
      productValue: 5,
      quality: 5,
      recommend: true,
      summary: 'Absolut fantastisch!',
      review: 'Der beste Rasierer, den ich je benutzt habe. Sehr sanft zur Haut und liefert trotzdem eine gründliche Rasur. Die Technologie ist beeindruckend und das Design ist ergonomisch. Kann dieses Produkt jedem empfehlen, der empfindliche Haut hat.',
      nickname: 'TestUser2024',
      birthMonth: '12',
      birthYear: '1990',
      gender: 'Weiblich',
      email: 'test.user@example.com',
      location: 'München',
      marketingConsent: true
    };
  }

  /**
   * Get negative review data
   */
  static getNegativeReviewData() {
    return {
      overallRating: 2,
      productValue: 2,
      quality: 2,
      recommend: false,
      summary: 'Nicht für mich geeignet',
      review: 'Leider hat der Rasierer bei mir nicht die gewünschten Ergebnisse erzielt. Die Rasur war nicht so gründlich wie erhofft und die Handhabung könnte besser sein. Vielleicht funktioniert er bei anderen besser.',
      nickname: 'CriticalUser',
      birthMonth: '3',
      birthYear: '1988',
      gender: 'Männlich',
      email: 'critical.user@test.de',
      location: 'Hamburg',
      marketingConsent: false
    };
  }

  /**
   * Get boundary test data - minimum valid values
   */
  static getBoundaryMinimumData() {
    return {
      overallRating: 1,
      productValue: 1,
      quality: 1,
      recommend: false,
      summary: 'Gut',
      review: 'Dies ist eine minimal gültige Bewertung mit genau fünfzig Zeichen für den Test der Mindestlänge.',
      nickname: 'AB',
      birthMonth: '1',
      birthYear: new Date().getFullYear() - 18, // Exactly 18 years old
      gender: 'Möchte ich nicht sagen',
      email: 'a@b.de',
      location: 'X',
      marketingConsent: false
    };
  }

  /**
   * Get boundary test data - maximum valid values
   */
  static getBoundaryMaximumData() {
    const longSummary = 'A'.repeat(100); // Assuming 100 char max
    const longReview = 'Dies ist eine sehr lange Bewertung. '.repeat(100); // ~3500 chars
    const longNickname = 'MaximumLengthNickname123';
    const longLocation = 'Very Long Location Name With District And Country Information';
    
    return {
      overallRating: 5,
      productValue: 5,
      quality: 5,
      recommend: true,
      summary: longSummary,
      review: longReview,
      nickname: longNickname,
      birthMonth: '12',
      birthYear: '1925', // Very old age
      gender: 'Divers',
      email: 'very.long.email.address.for.testing@example-domain.com',
      location: longLocation,
      marketingConsent: true
    };
  }

  /**
   * Get test data with special characters
   */
  static getSpecialCharacterData() {
    return {
      overallRating: 4,
      productValue: 4,
      quality: 4,
      recommend: true,
      summary: 'Überzeugende Qualität für Männer!',
      review: 'Große Überraschung! Das Produkt übertrifft meine Erwartungen. Besonders für empfindliche Haut - keine Rötungen mehr. €€€ wert! 5/5 Sterne ⭐',
      nickname: 'Müller_Jörg',
      birthMonth: '6',
      birthYear: '1985',
      gender: 'Männlich',
      email: 'test+review@example.com',
      location: 'Köln, Nordrhein-Westfalen',
      marketingConsent: false
    };
  }

  /**
   * Get invalid test data - empty required fields
   */
  static getEmptyRequiredFields() {
    return {
      overallRating: null,
      productValue: null,
      quality: null,
      recommend: null,
      summary: '',
      review: '',
      nickname: '',
      birthMonth: null,
      birthYear: null,
      gender: null,
      email: '',
      location: '',
      marketingConsent: false
    };
  }

  /**
   * Get invalid test data - malformed inputs
   */
  static getInvalidData() {
    return {
      summary: 'X', // Too short
      review: 'Too short', // Too short
      nickname: 'A', // Too short
      email: 'invalid-email', // Invalid format
      emailMissingAt: 'testexample.com',
      emailMissingDomain: 'test@',
      emailMissingTLD: 'test@example',
      location: '' // Empty
    };
  }

  /**
   * Get XSS attack test data
   */
  static getXSSTestData() {
    return {
      scriptTag: '<script>alert("XSS")</script>',
      imgTag: '<img src=x onerror=alert("XSS")>',
      iframeTag: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      eventHandler: 'javascript:alert("XSS")',
      encodedScript: '%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E'
    };
  }

  /**
   * Get SQL injection test data
   */
  static getSQLInjectionTestData() {
    return {
      dropTable: '\'; DROP TABLE reviews; --',
      union: '\' OR \'1\'=\'1',
      comment: '-- ',
      batchQuery: '\'; DELETE FROM users WHERE \'1\'=\'1',
      timeBased: '\' OR SLEEP(5) --'
    };
  }

  /**
   * Get test data for different genders
   */
  static getGenderOptions() {
    return ['Männlich', 'Weiblich', 'Divers', 'Möchte ich nicht sagen'];
  }

  /**
   * Get test data for birth years
   */
  static getBirthYearRange() {
    const currentYear = new Date().getFullYear();
    return {
      minAge: currentYear - 18, // Minimum valid age
      validAge: currentYear - 25, // Typical valid age
      oldAge: currentYear - 80, // Older user
      maxAge: currentYear - 100, // Very old age
      underAge: currentYear - 17 // Invalid - under 18
    };
  }

  /**
   * Get test email addresses with various formats
   */
  static getTestEmails() {
    return {
      valid: [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.de',
        'user_name@example.org',
        'user123@example.co.uk',
        'test-user@sub.example.com'
      ],
      invalid: [
        'invalid-email',
        'test@',
        '@example.com',
        'test@example',
        'test..double@example.com',
        'test @example.com',
        'test@.com',
        'test@domain .com'
      ]
    };
  }

  /**
   * Get incomplete form data for validation testing
   */
  static getIncompleteData(missingField) {
    const data = this.getValidReviewData();
    
    switch (missingField) {
      case 'overallRating':
        data.overallRating = null;
        break;
      case 'productValue':
        data.productValue = null;
        break;
      case 'quality':
        data.quality = null;
        break;
      case 'recommendation':
        data.recommend = null;
        break;
      case 'summary':
        data.summary = '';
        break;
      case 'review':
        data.review = '';
        break;
      case 'nickname':
        data.nickname = '';
        break;
      case 'birthDate':
        data.birthMonth = null;
        data.birthYear = null;
        break;
      case 'gender':
        data.gender = null;
        break;
      case 'email':
        data.email = '';
        break;
      case 'location':
        data.location = '';
        break;
      default:
        throw new Error(`Unknown field: ${missingField}`);
    }
    
    return data;
  }

  /**
   * Get random valid review data
   */
  static getRandomValidData() {
    const summaries = [
      'Ausgezeichnetes Produkt',
      'Sehr zufrieden',
      'Top Qualität',
      'Empfehlenswert',
      'Gutes Preis-Leistungs-Verhältnis'
    ];
    
    const reviews = [
      'Der Rasierer funktioniert hervorragend und ist sehr hautschonend. Die Verarbeitung ist erstklassig.',
      'Nach mehreren Wochen Nutzung kann ich sagen, dass sich der Kauf gelohnt hat. Sehr gute Rasur.',
      'Tolles Produkt für empfindliche Haut. Die SkinGuard Technologie funktioniert wie versprochen.',
      'Bin sehr zufrieden mit dem Rasierer. Die FlexBall Funktion ist praktisch und effektiv.'
    ];
    
    const nicknames = ['User' + Math.floor(Math.random() * 1000), 'Tester' + Math.floor(Math.random() * 1000), 'Kunde' + Math.floor(Math.random() * 1000)];
    const locations = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt'];
    
    return {
      overallRating: Math.floor(Math.random() * 5) + 1,
      productValue: Math.floor(Math.random() * 5) + 1,
      quality: Math.floor(Math.random() * 5) + 1,
      recommend: Math.random() > 0.3, // 70% positive
      summary: summaries[Math.floor(Math.random() * summaries.length)],
      review: reviews[Math.floor(Math.random() * reviews.length)],
      nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
      birthMonth: String(Math.floor(Math.random() * 12) + 1),
      birthYear: String(1950 + Math.floor(Math.random() * 55)),
      gender: this.getGenderOptions()[Math.floor(Math.random() * 4)],
      email: `test${Math.floor(Math.random() * 10000)}@example.com`,
      location: locations[Math.floor(Math.random() * locations.length)],
      marketingConsent: Math.random() > 0.5
    };
  }
}

export default ReviewTestData;
