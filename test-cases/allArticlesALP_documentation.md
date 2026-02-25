# Article Listing Page (ALP) - Test Documentation

## Overview
This test suite validates the functionality of the Article Listing Page on Gillette's staging environment.

**Page URL:** `https://stage.gillette.eu/en-eu/perfect-shave`

## Test Suite Structure

### Files Created/Modified:
1. **Page Object:** `pages/articleListingPage.js`
2. **Test Spec:** `tests/allArticlesALP.spec.js`
3. **Page Manager:** `utils/pageManager.js` (updated)
4. **Environment Config:** `test-data/environmentConfig.json` (updated)

## Test Cases

### TC1: Verify Page Loads with Title and Description
**Purpose:** Validate basic page load and content display

**Steps:**
1. Navigate to Article Listing Page
2. Verify URL contains '/perfect-shave'
3. Verify page title is present
4. Verify page description is present

**Expected Results:**
- ✅ Page loads successfully
- ✅ Page title is displayed
- ✅ Page description is displayed

---

### TC2: Verify Article Cards are Displayed
**Purpose:** Validate article cards are rendered

**Steps:**
1. Navigate to Article Listing Page
2. Count total article cards displayed

**Expected Results:**
- ✅ At least 1 article card is displayed
- ✅ Cards count is logged for reference

---

### TC3: Verify Article Cards Link to Correct Detail Pages
**Purpose:** Validate navigation from article cards to detail pages

**Steps:**
1. Navigate to Article Listing Page
2. For each article card (limited to first 3):
   - Extract article title and link
   - Open article detail page in new tab
   - Verify article title matches
   - Close tab

**Expected Results:**
- ✅ Article detail pages open correctly
- ✅ Article titles match between card and detail page

---

### TC4: Verify Adding Articles to Favorites
**Purpose:** Validate favorite functionality - adding articles

**Steps:**
1. Navigate to Article Listing Page
2. Get first article details
3. Click favorite icon on article card
4. Navigate to favorites page
5. Click favorites menu
6. Verify article appears in favorites list

**Expected Results:**
- ✅ Favorite icon can be clicked
- ✅ Article appears in favorites page
- ✅ Article title matches in favorites list

---

### TC5: Verify Removing Articles from Favorites
**Purpose:** Validate favorite functionality - removing articles

**Steps:**
1. Navigate to Article Listing Page
2. Get first article details
3. Add article to favorites (click favorite icon)
4. Remove article from favorites (click favorite icon again)
5. Navigate to favorites page
6. Verify article is NOT in favorites list

**Expected Results:**
- ✅ Article can be unfavorited
- ✅ Article does not appear in favorites page after removal

---

### TC6: Verify Dropdown Menu Navigation
**Purpose:** Validate article category dropdown navigation

**Steps:**
1. Navigate to Article Listing Page
2. Click dropdown button
3. Get all dropdown options (exclude "All Articles")
4. For each option (limited to first 2):
   - Click option to navigate
   - Verify URL matches expected URL
   - Close tab
5. Close dropdown menu

**Expected Results:**
- ✅ Dropdown opens successfully
- ✅ Options are displayed
- ✅ Navigation to each option works correctly
- ✅ URLs match expected values

---

## Page Object Methods

### Navigation Methods
- `navigateToALP()` - Navigate to Article Listing Page
- `navigateToFavoritesPage(context)` - Open favorites page in new tab
- `selectDropdownOption(title, context)` - Select dropdown option

### Element Interaction Methods
- `clickFavoriteIcon(index)` - Click favorite icon for article at index
- `openDropdown()` - Open dropdown menu
- `closeDropdown()` - Close dropdown menu
- `clickFavoritesMenu(favPage)` - Click favorites menu on favorites page

### Data Retrieval Methods
- `getPageTitle()` - Get page title text
- `getPageDescription()` - Get page description with normalized whitespace
- `getArticleCardsCount()` - Get total count of article cards
- `getArticleDetails(index)` - Get article title and link by index
- `getDropdownOptions(excludeTitle)` - Get all dropdown options

### Verification Methods
- `isArticleInFavorites(favPage, articleTitle)` - Check if article exists in favorites
- `verifyArticleDetailPage(articlePage, expectedTitle)` - Verify article title on detail page

---

## How to Run Tests

### Run All Tests
```bash
npx playwright test tests/allArticlesALP.spec.js
```

### Run Specific Test
```bash
npx playwright test tests/allArticlesALP.spec.js -g "TC1"
```

### Run with UI Mode
```bash
npx playwright test tests/allArticlesALP.spec.js --ui
```

### Run in Debug Mode
```bash
npx playwright test tests/allArticlesALP.spec.js --debug
```

### Run with Specific Browser
```bash
npx playwright test tests/allArticlesALP.spec.js --project=chromium
```

---

## Framework Integration

### Environment Configuration
Added to `test-data/environmentConfig.json`:
```json
"gillette-stage": {
  "baseUrl": "https://stage.gillette.eu/en-eu",
  "apiUrl": "https://api-stage.gillette.eu",
  "requiresAuth": false
}
```

### Page Manager Registration
The `articleListingPage` is registered in `pageManager.js`:
```javascript
onArticleListingPage() {
  return this.articleListingPage;
}
```

### Usage Example
```javascript
import { pageManager } from '../utils/pageManager.js';

const pm = new pageManager(page);
await pm.onArticleListingPage().navigateToALP();
const count = await pm.onArticleListingPage().getArticleCardsCount();
```

---

## Locators Used

| Element | Locator | Description |
|---------|---------|-------------|
| Page Title | `h1` | Main page heading |
| Page Description | `//*[@id="wrap"]/div[1]/div[2]/div/p` | Page description text |
| Article Cards | `//*[@id="main-content"]/div/div[3]/div/div[2]/div[2]/div` | All article cards |
| Article Title | `//*[@id="wrap"]/div[2]/div[3]/ul/li[{index}]/div/div/a/div[2]/h3` | Article title by index |
| Favorite Icon | `//*[@id="wrap"]/div[2]/div[3]/ul/li[{index}]/div/div/a/div[2]/button` | Favorite button |
| Dropdown Button | `//*[@id="dropdownButton"]` | Dropdown menu trigger |
| Dropdown Options | `//*[@id="react-portal"]/div[2]/div[2]/a` | Dropdown menu options |

---

## Notes

### Test Optimizations
- Article navigation tests are limited to first 3 articles for efficiency
- Dropdown navigation tests are limited to first 2 options
- These limits can be adjusted as needed

### Framework Benefits
- ✅ Follows established Page Object Model pattern
- ✅ Uses framework's logging utilities (SYMBOLS)
- ✅ Integrates with setupTest for context clearing
- ✅ Properly structured test organization
- ✅ Reusable page methods for future tests

### Future Enhancements
- Add visual regression testing for article cards
- Add API validation for favorites functionality
- Add accessibility testing
- Add performance metrics tracking
