# Homepage Regression Checks

## **Objective**
Conduct a regression checks of Homepage in the GERMANY website

**Homepage Regression Test Cases**

## Test Case 1: Check whether the homepage loads properly.
**Test ID:** TC-Homepage-01
**Steps:** 
1. Navigate to https://www.gillette.de/de-de. and wait until the page fully loads.
**Expected Result:**
The homepage must load successfully and display all elements correctly without any errors. The UI design should be aligned successfully. The following sections must be visible on the homepage:

1. Homepage Banners
2. "Alles, was du brauchst"
3. "Unsere Produkte"
4. "Erfahre etwas Neues"
5. "Gillette unterstützt Männer dabei, jeden Tag gut auszusehen, sich gut zu fühlen und das Beste aus sich herauszuholen".
---

## Test Case 2: Verify the logo container in Header
**Test ID:** TC-Homepage-02
**Steps:** 
1. Locate the brand logo container in the header section.
**Expected Result:**
The container should be visible and properly aligned in the header.

2. Verify that the container includes all four brand logos:
   - Gillette
   - Gillette Labs (GilletteLabs)
   - Gillette Body & Intimate
   - King C. Gillette
**Expected Result:**
All four brand logos should be displayed correctly with proper images loaded. Each logo should have appropriate alt text in German. List all visible logos in the output.

3. Verify each logo is clickable and has a valid href attribute:
   - Check Gillette logo link
   - Check Gillette Labs logo link
   - Check Gillette Body & Intimate logo link
   - Check King C. Gillette logo link
**Expected Result:**
Each logo should be an active link element with a valid URL. Display the href value for each logo in the output.

4. Click the "Gillette" logo.
**Expected Result:**
The browser should redirect to the correct Gillette brand section page. Verify the URL and page title after redirection.

5. Navigate back to homepage and click the "Gillette Labs" logo.
**Expected Result:**
The browser should redirect to the Gillette Labs brand section page. Verify the URL contains "gillette-labs" or appropriate identifier.

6. Navigate back to homepage and click the "Gillette Body & Intimate" logo.
**Expected Result:**
The browser should redirect to the Gillette Body & Intimate brand section page. Verify the URL and page content.

7. Navigate back to homepage and click the "King C. Gillette" logo.
**Expected Result:**
The browser should redirect to the King C. Gillette brand section page. Verify the URL contains "king-c-gillette" or appropriate identifier.
---

## Test Case 3: Verify the Gillette main logo in the header.
**Test ID:** TC-Homepage-03
**Steps:** 
1. Locate the main Gillette logo in the header navigation (typically positioned on the left side).
**Expected Result:**
The main Gillette logo should be visible, properly loaded, and displayed prominently in the header.

2. Verify the logo image properties:
   - Image source (src) is valid
   - Alt text is present and in German
   - Logo is properly sized and aligned
**Expected Result:**
The logo should have all required attributes. The image should be sharp and properly rendered without distortion. Display the alt text and src URL in the output.

3. Verify the logo is clickable and functions as a home link.
**Expected Result:**
The logo should be wrapped in an anchor tag (<a>) with href pointing to homepage URL (https://www.gillette.de/de-de or root path).

4. Click the main Gillette logo.
**Expected Result:**
The browser should redirect to the homepage (https://www.gillette.de/de-de). Verify the current URL matches the homepage URL.

5. Navigate to any product page or article page, then click the main Gillette logo again.
**Expected Result:**
From any page within the site, clicking the main logo should return the user to the homepage. Verify successful navigation and homepage content loads properly.
---

## Test Case 4: Check that navigation to various Article (Blog) categories works correctly.
**Test ID:** TC-Homepage-04
**Steps:** 
1. Hover over the Article ("Blog") menu and verify that all Article Category options are clickable and redirect to the correct pages.
**Expected Result:**
The article category name should be displayed, and it must also appear in the output.
The user should be redirected to the selected article category page. Verify that all article titles listed on the page are displayed correctly in the output.
---

## Test Case 5: Check that navigation to various Products (Produkte) categories works correctly.
**Test ID:** TC-Homepage-05
**Steps:** 
1. Hover over the Products ("Produkte") menu and verify that the following sub‑categories are displayed: "Produkttyp", "Portfolio", and "Bedürfnis".
**Expected Result:**
The specified product sub‑categories should be displayed along with their respective sub‑options. Display the list of sub‑options corresponding to each sub‑category.

2. Click each sub‑option and verify that the browser opens the correct corresponding page.
**Expected Result:**
The browser should redirect to the correct page.
---

## Test Case 6: Check that navigation to various About Gillette (Über Gillette) categories works correctly.
**Test ID:** TC-Homepage-06
**Steps:** 
1. Hover over the About Gillette ("Über Gillette") menu and verify that the following sub‑categories are displayed: "Über Gillette" and "Engagement".
**Expected Result:**
The specified About Gillette sub‑categories should be displayed along with their respective sub‑options. Display the list of sub‑options corresponding to each sub‑category.

2. Click each sub‑option and verify that the browser opens the correct corresponding page.
**Expected Result:**
The browser should redirect to the correct page.
---

## Test Case 7: Verify the Favorite Page
**Test ID:** TC-Homepage-07
**Steps:** 
1. Click favorite icon
**Expected Result:**
The browser should open the Favorites page. 
The page should contain three recommended products and three recommended articles, displayed under separate tabs. If the user has any favorite products or articles, the recommended items should be hidden and the selected favorites should be displayed instead.
---

## Test Case 8: Verify that the search feature operates as expected.
**Test ID:** TC-Homepage-08
**Steps:** 
1. Type a product name (e.g., "Fusion5") into the search bar.
2. Click the search icon or press Enter to initiate the search.
**Expected Result:**
The search results page should display match the entered search term.

3. Click the Articles listed under the Articles tab and the Products listed under the Products tab.
**Expected Result:**
The browser should redirect to the correct page.
---

## Test Case 9: Verify that the search feature operates as expected with unwanted search.
**Test ID:** TC-Homepage-09
**Steps:** 
1. Type a product name (e.g., "xyz123test@@@###$$$") into the search bar.
2. Click the search icon or press Enter to initiate the search.
**Expected Result:**
The search results page should display match the entered search term.
---

## Test Case 10: Verify the Homepage banner.
**Test ID:** TC-Homepage-10
**Steps:** 
1. Verify the Homepage banner.
**Expected Result:**
The homepage banner should be displayed along with its CTA button. If multiple banners are available, a horizontal slider should be visible. Additionally, the banner must support auto‑scroll functionality.

2. If multiple banners exist, verify carousel navigation arrows (Previous/Next) are visible and clickable.
**Expected Result:**
Carousel arrows should be present and enabled. Display the total number of banner slides available.

3. Click the "Next" carousel arrow to navigate to the next banner slide.
**Expected Result:**
The banner should transition smoothly to the next slide. The active slide indicator should update accordingly. Verify the new banner content is displayed.

4. Click the "Previous" carousel arrow to navigate back to the previous banner slide.
**Expected Result:**
The banner should transition smoothly to the previous slide. Verify the content returns to the previously viewed banner.

5. Navigate through all available banner slides by clicking the "Next" arrow repeatedly.
**Expected Result:**
Each banner slide should be accessible and display properly. List all banner titles/content in the output.

6. Click the CTA button on each banner slide.
**Expected Result:**
Each CTA button should redirect to a valid page. Verify the URL and page title after each redirection.
---

## Test Case 11: Verify that the packshots in the "Alles, was du brauchst" section redirect to the correct pages.
**Test ID:** TC-Homepage-11
**Steps:** 
1. Scroll to the "Alles, was du brauchst" section and verify that packshots/cards are displayed.
**Expected Result:**
Verify that all packshots are visible and list all packshot names/titles in the output. Display the total count of packshots available in this section.

2. If the section displays more than three packshots, verify that carousel navigation arrows appear.
**Expected Result:**
Carousel arrows (Previous/Next) should be visible and enabled for navigation. Confirm their presence in the output.

3. Click each visible packshot/card one by one (starting with the first three visible cards).
**Expected Result:**
Each packshot should be clickable. The browser should redirect to a valid product or category page. List the destination URL and page title for each clicked packshot.

4. If carousel arrows are present, click the "Next" arrow to reveal additional packshots.
**Expected Result:**
The carousel should slide to display the next set of packshots. New packshots should become visible.

5. Click each newly revealed packshot/card.
**Expected Result:**
Each packshot should redirect to a valid page. Verify and list the destination URL for each.

6. Continue clicking the "Next" arrow and testing all packshots until all cards in the carousel have been clicked and verified.
**Expected Result:**
All packshots in the "Alles, was du brauchst" section should be verified as clickable and redirecting to valid pages. Display a summary of total packshots tested.

7. Click the "Previous" arrow to navigate back through the carousel.
**Expected Result:**
The carousel should navigate backwards smoothly, displaying previously viewed packshots.
---

## Test Case 12: Verify that the packshots in the "Unsere Produkte" section redirect to the correct pages.
**Test ID:** TC-Homepage-12
**Steps:** 
1. Scroll to the "Unsere Produkte" section and verify that packshots/cards are displayed.
**Expected Result:**
Verify that all packshots are visible and list all packshot names/titles in the output. Display the total count of packshots available in this section.

2. If the section displays more than three packshots, verify that carousel navigation arrows appear.
**Expected Result:**
Carousel arrows (Previous/Next) should be visible and enabled for navigation. Confirm their presence in the output.

3. Click each visible packshot/card one by one (starting with the first three visible cards).
**Expected Result:**
Each packshot should be clickable. The browser should redirect to a valid product or category page. List the destination URL and page title for each clicked packshot.

4. If carousel arrows are present, click the "Next" arrow to reveal additional packshots.
**Expected Result:**
The carousel should slide to display the next set of packshots. New packshots should become visible. Verify the arrow is functional and responsive.

5. Click each newly revealed packshot/card.
**Expected Result:**
Each packshot should redirect to a valid page. Verify and list the destination URL for each.

6. Continue clicking the "Next" arrow and testing all packshots until all cards in the carousel have been clicked and verified.
**Expected Result:**
All packshots in the "Unsere Produkte" section should be verified as clickable and redirecting to valid pages. Display a summary of total packshots tested.

7. Click the "Previous" arrow to navigate back through the carousel.
**Expected Result:**
The carousel should navigate backwards smoothly, displaying previously viewed packshots. Verify the "Previous" arrow functionality works correctly.
---

## Test Case 13: Verify that the packshots in the "Erfahre etwas Neues" section redirect to the correct pages.
**Test ID:** TC-Homepage-13
**Steps:** 
1. Scroll to the "Erfahre etwas Neues" section and verify that packshots/cards are displayed.
**Expected Result:**
Verify that all packshots are visible and list all packshot names/titles in the output. Display the total count of packshots available in this section.

2. If the section displays more than three packshots, verify that carousel navigation arrows appear.
**Expected Result:**
Carousel arrows (Previous/Next) should be visible and enabled for navigation. Confirm their presence in the output.

3. Click each visible packshot/card one by one (starting with the first three visible cards).
**Expected Result:**
Each packshot should be clickable. The browser should redirect to a valid article or content page. List the destination URL and page title for each clicked packshot.

4. If carousel arrows are present, click the "Next" arrow to reveal additional packshots.
**Expected Result:**
The carousel should slide to display the next set of packshots. New packshots should become visible. Verify the arrow is functional and responsive.

5. Click each newly revealed packshot/card.
**Expected Result:**
Each packshot should redirect to a valid page. Verify and list the destination URL for each.

6. Continue clicking the "Next" arrow and testing all packshots until all cards in the carousel have been clicked and verified.
**Expected Result:**
All packshots in the "Erfahre etwas Neues" section should be verified as clickable and redirecting to valid pages. Display a summary of total packshots tested.

7. Click the "Previous" arrow to navigate back through the carousel.
**Expected Result:**
The carousel should navigate backwards smoothly, displaying previously viewed packshots. Verify the "Previous" arrow functionality works correctly.
---

## Test Case 14: Verify the "Gillette unterstützt Männer dabei, jeden Tag gut auszusehen, sich gut zu fühlen und das Beste aus sich herauszuholen" section redirect to the correct pages.
**Test ID:** TC-Homepage-14
**Steps:** 
1. Verify the section.
**Expected Result:**
The section should display an image on the left side and content on the right side, along with a CTA button.

2. Click CTA button
**Expected Result:**
The browser should redirect to a valid page.
---

## Test Case 15: Verify the Footer navigation options
**Test ID:** TC-Homepage-15
**Steps:** 
1. Verify the Footer
**Expected Result:**
The footer should include the categories “Blog,” “Produkttyp,” “Produkttyp,” and “Über Gillette.” Each category must display its corresponding sub‑options, with all sub‑options listed under their respective categories.

2. Click each sub options
**Expected Result:**
The browser should redirect to a valid page.
---

## Test Case 16: Verify the logo Box in Footer.
**Test ID:** TC-Homepage-16
**Steps:** 
1. Verify the logo box.
**Expected Result:**
The box should include the following logos: Gillette, Gillette Labs, Gillette Body & Intimate, and King C. Gillette.

2. Click each logos
**Expected Result:**
The browser should redirect to the correct page.

## Test Case 17: Verify the Social Icons in Footer.
**Test ID:** TC-Homepage-17
**Steps:** 
1. Verify the Social Icons
**Expected Result:**
The social icons should include icons for YouTube, Instagram, and Facebook.

2. Click each icons
**Expected Result:**
The browser should redirect to the correct page in new tab.

## Test Case 18: Verify the Country Selector (Deutschland) in Footer.
**Test ID:** TC-Homepage-18
**Steps:** 
1. Verify the Country Selector
**Expected Result:**
The browser should successfully open the country selector page.

## Test Case 19: Verify the Privacy links in Footer.
**Test ID:** TC-Homepage-19
**Steps:** 
1. Verify the Privacy links
**Expected Result:**
The Privacy section should include the links “Impressum,” “Datenschutz,” “Meine Daten,” and “Meine Cookie-Auswahl”.

2. Click “Impressum,” “Datenschutz,” “Meine Daten".
**Expected Result:**
The browser should redirect to the correct page in new tab.

3. Click “Meine Cookie-Auswahl”.
**Expected Result:**
The browser should display the cookie popup.
---

## Test Case 20: Verify the Sitemap ("Seitenverzeichnis") in Footer.
**Test ID:** TC-Homepage-20
**Steps:** 
1. Verify the Sitemap
**Expected Result:**
The browser should successfully open the sitemap page.
---

## Test Case 21: Verify the SEO components
**Test ID:** TC-Homepage-21
**Steps:** 
1. Verify the SEO components, including Meta Title, Meta Description, OG Title, OG Description, Canonical URL, H1, H2, H3 and Image alt text for all images.
**Expected Result:**
The specified SEO components should be displayed clearly in the output during execution:
- **Meta Title**: Display the page's meta title
- **Meta Description**: Display the full meta description
- **Canonical URL**: Display the canonical URL and verify it contains "gillette.de"
- **H1 Tags**: Display total count and list all H1 tags found on the page
- **H2 Tags**: Display total count and list all H2 tags found on the page
- **H3 Tags**: Display total count and list all H3 tags found on the page
- **Image Alt Text**: Display alt text for ALL images on the page, including:
  - Total number of images found
  - Number of images with alt text
  - Number of images without alt text
  - List each image with its alt text and source URL
  - Mark visibility status for each image
- **Summary Statistics**: Display overall counts and percentages for SEO completeness
---
