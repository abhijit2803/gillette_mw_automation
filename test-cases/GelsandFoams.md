# Gels and Foams Product Detail Page (PDP) - Manual Test Cases

## Test Suite Information
**Test Suite Name:** Gels and Foams PDP Sanity Testing  
**Module:** Product Detail Page (PDP)  
**Product Category:** Gels and Foams  
**Test Type:** Functional Testing  
**Test Environment:** Production/Staging (Germany)  
**Browser:** Chrome (Latest Version)  

---

## Prerequisites
1. Test data file with product URLs (Excel file: `Gels_Foams_URLs_Germany.xlsx`)
2. Valid test user account credentials
3. Browser: Chrome (latest version)
4. Stable internet connection
5. Access to https://www.gillette.de/

---

## Test Case 1: Browser Initialization and URL Navigation

**Test Case ID:** TC-GF-001  
**Test Objective:** Verify that the browser launches successfully and navigates to the product page

### Test Steps:
1. Open Chrome browser
2. Maximize the browser window
3. Navigate to the Gels and Foams product URL from the test data file
4. Wait for the page to load completely (approximately 10 seconds)

### Expected Results:
- Browser should launch successfully
- Browser window should be maximized
- The product page URL should load without errors
- Page should be fully rendered

### Pass Criteria:
✅ Browser initialized successfully  
✅ Page loaded within acceptable time  
✅ No console errors or broken elements

---

## Test Case 2: Accept Cookies Banner

**Test Case ID:** TC-GF-002  
**Test Objective:** Verify that the cookies acceptance banner appears and can be accepted

### Test Steps:
1. On the product page, locate the "Accept All Cookies" button
2. Wait for the button to be clickable
3. Click on the "Accept All Cookies" button
4. Wait for 2 seconds for cookies to be processed

### Expected Results:
- Cookie banner should be visible on page load
- "Accept All Cookies" button should be clickable
- Cookie banner should disappear after clicking accept
- Cookies should be stored in the browser

### Pass Criteria:
✅ Cookies accepted successfully  
✅ Cookie banner is dismissed

---

## Test Case 3: URL Validation and Product Page Load

**Test Case ID:** TC-GF-003  
**Test Objective:** Verify that the correct product page is loaded and URL matches the expected URL

### Test Steps:
1. After accepting cookies, capture the current URL from the browser address bar
2. Compare the current URL with the expected product URL from test data
3. Verify that no redirects occurred to unexpected pages

### Expected Results:
- Current URL should match the input product URL
- No unexpected redirects should occur
- Page should display product details

### Pass Criteria:
✅ URL loaded successfully and matches input product URL  
✅ Page is the correct product detail page

---

## Test Case 4: Product Name Verification

**Test Case ID:** TC-GF-004  
**Test Objective:** Verify that the product name is displayed correctly on the PDP

### Test Steps:
1. Locate the H1 tag on the product page
2. Extract and record the product name text from the H1 tag
3. Verify that the product name is not empty
4. Verify that the product name is relevant to Gels and Foams category

### Expected Results:
- H1 tag should be present on the page
- Product name should be clearly visible and readable
- Product name should not be empty or null

### Pass Criteria:
✅ Product name is displayed correctly  
✅ Product name matches the expected product from test data

---

## Test Case 5: Facebook Icon Functionality

**Test Case ID:** TC-GF-005  
**Test Objective:** Verify that the Facebook share icon works correctly and opens Facebook in a popup

### Test Steps:
1. Locate the Facebook icon on the product page (ID: `imgBtnFacebook`)
2. Click on the Facebook icon
3. Wait for 3 seconds for the popup window to load
4. Switch to the newly opened popup window
5. Verify that the Facebook page contains the expected URL reference: `https://www.gillette.de/`
6. Close the Facebook popup using the close button (X icon)
7. Switch back to the main product page window

### Expected Results:
- Facebook icon should be visible and clickable
- A new popup window should open showing Facebook
- The popup should contain reference to Gillette website
- Close button should close the popup
- Main window should remain active after closing popup

### Pass Criteria:
✅ Facebook Icon clicked successfully  
✅ Facebook popup opened with correct content  
✅ Popup closed successfully and returned to main window

---

## Test Case 6: Copy URL Functionality

**Test Case ID:** TC-GF-006  
**Test Objective:** Verify that the Copy URL functionality works correctly

### Test Steps:
1. Locate the Copy URL icon on the product page (ID: `imgBtncopyLink`)
2. Click on the Copy URL icon
3. Wait for 5 seconds for the popup to appear
4. Switch to the popup window
5. Locate the copy link element (ID: `copyLink`)
6. Verify that the URL value in the copy field matches the current product page URL
7. Close the Copy URL popup
8. Switch back to the main window

### Expected Results:
- Copy URL icon should be visible and clickable
- Copy URL popup should open
- The URL in the copy field should match the current product page URL
- Close button should dismiss the popup

### Pass Criteria:
✅ Copy URL Icon clicked successfully  
✅ Copied URL matches with current product URL  
✅ Popup closed successfully

---

## Test Case 7: Favorite Product Functionality

**Test Case ID:** TC-GF-007  
**Test Objective:** Verify that users can add products to favorites and view them in the favorites page

### Test Steps:
1. Locate the Favorite/Heart icon on the product page
2. Click on the Favorite icon to add the product to favorites
3. Click on the Favorite/Heart icon in the header to open favorites page in a new tab
4. Switch to the newly opened favorites page tab
5. Click on the "Products" menu in the favorites page
6. Verify that the product name in the favorites list matches the original product name
7. Close the favorites tab
8. Return to the main product page

### Expected Results:
- Favorite icon should be clickable
- Product should be added to favorites
- Favorites page should open in a new tab
- Added product should appear in the favorites list
- Product name should match exactly

### Pass Criteria:
✅ Favorite Icon clicked successfully  
✅ Product added to favorites  
✅ Correct product displayed in favorites list  
✅ Product name matches between PDP and favorites page

---

## Test Case 8: Buy Now Button Functionality

**Test Case ID:** TC-GF-008  
**Test Objective:** Verify that the Buy Now button opens the online retailers popup

### Test Steps:
1. Scroll to locate the "Buy Now" button on the product page
2. Click on the "Buy Now" button
3. Wait for 5 seconds for the popup to load
4. Switch to the popup window
5. Verify that the popup heading displays "Online-Händler" (Online Retailers)
6. Close the Buy Now popup using the close button
7. Switch back to the main product page window

### Expected Results:
- Buy Now button should be visible and clickable
- Popup should open showing online retailers
- Popup heading should display "Online-Händler"
- Close button should dismiss the popup

### Pass Criteria:
✅ Buy Now Button clicked successfully  
✅ Online retailers popup opened with correct heading  
✅ Popup closed successfully and returned to main window

---

## Test Case 9: Feature Section Menu Navigation

**Test Case ID:** TC-GF-009  
**Test Objective:** Verify that clicking on the Feature Section menu navigates to the features section

### Test Steps:
1. Move mouse away from the header to avoid any hover menus
2. Wait for any dropdown menus to disappear
3. Locate the "Feature Section" button in the menu (first button in inner-tabs)
4. Click on the "Feature Section" button
5. Wait for 2 seconds for the page to scroll
6. Verify that the page scrolls to the Feature section
7. Verify that the Feature section content is displayed
8. Record the first feature heading text

### Expected Results:
- Feature Section menu button should be clickable
- Page should smoothly scroll to the Feature section
- Feature section should be visible and displayed correctly
- Feature heading should be readable

### Pass Criteria:
✅ Feature Section menu clicked successfully  
✅ Page scrolled to Feature section  
✅ Feature section content is displayed correctly

---

## Test Case 10: Review Section Menu Navigation

**Test Case ID:** TC-GF-010  
**Test Objective:** Verify that clicking on the Review Section menu navigates to the reviews section

### Test Steps:
1. Locate the "Review Section" button in the menu (second button in inner-tabs)
2. Click on the "Review Section" button
3. Wait for 4 seconds for the page to scroll
4. Verify that the page scrolls to the Review section
5. Verify that the "BEWERTUNG SCHREIBEN" (Write A Review) button is visible
6. Record that the Review section is correctly displayed

### Expected Results:
- Review Section menu button should be clickable
- Page should smoothly scroll to the Review section
- Review section should be visible with "Write A Review" button
- Review section should contain customer reviews (if available)

### Pass Criteria:
✅ Review Section menu clicked successfully  
✅ Page scrolled to Review section  
✅ "BEWERTUNG SCHREIBEN" button is visible

---

## Test Case 11: Write A Review Button Visibility

**Test Case ID:** TC-GF-011  
**Test Objective:** Verify that the Write A Review button is present and visible in the Review section

### Test Steps:
1. In the Review section, locate the "Write A Review" button
2. Verify that the button is displayed
3. Verify that the button text is readable
4. Wait for 3 seconds

### Expected Results:
- Write A Review button should be visible
- Button should be properly styled and readable
- Button should be in the Review section

### Pass Criteria:
✅ Write A Review Button is displayed  
✅ Button is located in the correct section

---

## Test Case 12: Write A Review Page Navigation

**Test Case ID:** TC-GF-012  
**Test Objective:** Verify that clicking Write A Review button navigates to the review form page

### Test Steps:
1. Click on the "Write A Review" button in the Review section
2. Wait for the review form page to load
3. Capture the current URL
4. Locate the H1 tag or page title on the review page
5. Extract the product name from the review page
6. Compare the product name on the review page with the original product name from PDP

### Expected Results:
- Page should navigate to the Write A Review form
- Review form page should load successfully
- Product name on review page should match the PDP product name
- Review form fields should be visible

### Pass Criteria:
✅ Write A Review Button clicked successfully  
✅ Review form page loaded  
✅ Product name on review page matches PDP product name

---

## Test Case 13: Cancel Button on Write A Review Page

**Test Case ID:** TC-GF-013  
**Test Objective:** Verify that clicking Cancel on the review page returns to the original product page

### Test Steps:
1. On the Write A Review form page, locate the "Cancel" button/link
2. Click on the "Cancel" button
3. Wait for 3 seconds for navigation
4. Verify that the page returns to the original product detail page
5. Compare the current URL with the original product URL

### Expected Results:
- Cancel button should be visible and clickable
- Page should navigate back to the product detail page
- Current URL should match the original product URL
- No data should be saved or submitted

### Pass Criteria:
✅ Cancel Button clicked successfully  
✅ Returned to product detail page  
✅ URL matches original product URL

---

## Test Case 14: Related Products Section Verification

**Test Case ID:** TC-GF-014  
**Test Objective:** Verify that all three related products link correctly to their respective product pages

### Test Steps:
1. Scroll down to the "Related Products" section
2. Verify that three product cards are displayed in the Related Products section
3. **For Product 1 (Position 1):**
   - Locate the first product card
   - Record the product name shown on the card
   - Record the product URL/link from the card
   - Open the product link in a new browser tab
   - Wait for 5 seconds for the page to load
   - On the newly opened product page, locate the H1 tag
   - Extract the product name from the H1 tag
   - Compare the product name from the card with the product name on the PDP
   - Close the new tab and return to the original product page
4. **For Product 2 (Position 2):**
   - Locate the second product card
   - Record the product name shown on the card
   - Record the product URL/link from the card
   - Open the product link in a new browser tab
   - Wait for 5 seconds for the page to load
   - On the newly opened product page, locate the H1 tag
   - Extract the product name from the H1 tag
   - Compare the product name from the card with the product name on the PDP
   - Close the new tab and return to the original product page
5. **For Product 3 (Position 3):**
   - Locate the third product card
   - Record the product name shown on the card
   - Record the product URL/link from the card
   - Open the product link in a new browser tab
   - Wait for 5 seconds for the page to load
   - On the newly opened product page, locate the H1 tag
   - Extract the product name from the H1 tag
   - Compare the product name from the card with the product name on the PDP
   - Close the new tab and return to the original product page

### Expected Results:
- Three related product cards should be displayed in the Related Products section
- Each product card should display product name and image
- Each product link should be clickable
- Clicking each link should open the correct product page
- Product name on each card should match the product name on the respective PDP
- All three products should navigate correctly

### Pass Criteria:
✅ All three related product cards are displayed  
✅ First product link opened successfully and name matches  
✅ Second product link opened successfully and name matches  
✅ Third product link opened successfully and name matches  
✅ All product names match between cards and PDPs

---

## Test Case 15: Related Articles Section Verification

**Test Case ID:** TC-GF-015  
**Test Objective:** Verify that all three related articles link correctly to their respective article pages

### Test Steps:
1. Scroll down to the "Related Articles" section
2. Verify that three article cards are displayed in the Related Articles section
3. **For Article 1 (Position 1):**
   - Locate the first article card
   - Record the article title shown on the card
   - Record the article URL/link from the card
   - Open the article link in a new browser tab
   - Wait for 3 seconds for the page to load
   - On the newly opened article page, locate the H1 tag
   - Extract the article title from the H1 tag
   - Compare the article title from the card with the article title on the article page
   - Close the new tab and return to the original product page
4. **For Article 2 (Position 2):**
   - Locate the second article card
   - Record the article title shown on the card
   - Record the article URL/link from the card
   - Open the article link in a new browser tab
   - Wait for 3 seconds for the page to load
   - On the newly opened article page, locate the H1 tag
   - Extract the article title from the H1 tag
   - Compare the article title from the card with the article title on the article page
   - Close the new tab and return to the original product page
5. **For Article 3 (Position 3):**
   - Locate the third article card
   - Record the article title shown on the card
   - Record the article URL/link from the card
   - Open the article link in a new browser tab
   - Wait for 3 seconds for the page to load
   - On the newly opened article page, locate the H1 tag
   - Extract the article title from the H1 tag
   - Compare the article title from the card with the article title on the article page
   - Close the new tab and return to the original product page

### Expected Results:
- Three related article cards should be displayed in the Related Articles section
- Each article card should display article title and image
- Each article link should be clickable
- Clicking each link should open the correct article page
- Article title on each card should match the article title on the respective article page
- All three articles should navigate correctly

### Pass Criteria:
✅ All three related article cards are displayed  
✅ First article link opened successfully and title matches  
✅ Second article link opened successfully and title matches  
✅ Third article link opened successfully and title matches  
✅ All article titles match between cards and article pages

---