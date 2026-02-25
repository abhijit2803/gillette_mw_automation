# Product Listing Page Regression Checks

## **Objective**
Conduct a regression checks of Product Listing Page in the GERMANY website

**Product Listing Page Regression Test Cases**

## Test Case 1: Check whether the Product Listing Page loads properly.
**Test ID:** TC-PLP-01
**Steps:** 
1. Go to https://www.gillette.de/de-de/produkte.
2. Ensure that the page loads fully without any errors.
3. Verify that the main header ‘Produkte’ is displayed correctly.
**Expected Result:**
The page loads fully without any errors, and each product should display Ratings, a "MEHR ERFAHREN" button, and a JETZT KAUFEN button.

1. Verify that all links on the page function correctly
**Expected Result:**
All images on the page are loaded and displayed correctly.
---

## Test Case 2: Verify the category tabs.
**Test ID:** TC-PLP-02
**Steps:** 
1. Click each tab and verify the list of products displayed.
**Expected Result:**
Each tab should be clickable, and the corresponding list of products should be displayed. Show these products in the output.

## Test Case 3: Verify that all links on the page function correctly
**Test ID:** TC-PLP-03
**Steps:** 
1. Verify that all links on the page function correctly and navigate to their intended destinations.
**Expected Result:**
All links on the page function correctly and navigate to their intended destinations.
---

## Test Case 4: "More Information" button functionality
**Test ID:** TC-PLP-04
**Steps:** 
1. Click the "MEHR ERFAHREN" button for each product.
**Expected Result:**
The browser must navigate to the product’s PDP.
---

## Test Case 5: "Buy Now" button functionality
**Test ID:** TC-PLP-05
**Steps:** 
1. Click "JETZT KAUFEN" button
**Expected Result:**
The “Wählen Sie einen Händler” popup should appear with the list of retailers if any are available, and the retailer links should also be displayed in output.
---

## Test Case 6: Filter: “NACH TYP” filter functionality
**Test ID:** TC-PLP-06
**Steps:** 
1. Individually select each option under the “NACH TYP” filter, then click the “ANWENDEN” button.
**Expected Result:**
Products should be displayed based on the selected option.
---

## Test Case 7: Filter: “NACH THEMA” filter functionality
**Test ID:** TC-PLP-07
**Steps:** 
1. Individually select each option under the “NACH THEMA” filter, then click the “ANWENDEN” button.
**Expected Result:**
Products should be displayed based on the selected option.
---

## Test Case 8: Filter: “NACH KOLLEKTIONEN” filter functionality
**Test ID:** TC-PLP-08
**Steps:** 
1. Individually select each option under the “NACH KOLLEKTIONEN” filter, then click the “ANWENDEN” button.
**Expected Result:**
Products should be displayed based on the selected option.
---

## Test Case 9: Filter: “SORTIEREN NACH” filter functionality
**Test ID:** TC-PLP-09
**Steps:** 
1. Individually select each option under the “SORTIEREN NACH” filter, then click the “ANWENDEN” button.
**Expected Result:**
Products should be displayed based on the selected option.
---

## Test Case 10: Filter Deny: “NACH TYP” filter functionality
**Test ID:** TC-PLP-10
**Steps:** 
1. Individually select each option under the “NACH TYP” filter, then click the “ALLES LÖSCHEN” button.
**Expected Result:**
The displayed products should remain unchanged since no filter has been selected.
---

## Test Case 11: Filter Deny: “NACH THEMA” filter functionality
**Test ID:** TC-PLP-11
**Steps:** 
1. Individually select each option under the “NACH THEMA” filter, then click the “ALLES LÖSCHEN” button.
**Expected Result:**
The displayed products should remain unchanged since no filter has been selected.
---

## Test Case 12: Filter deny: “NACH KOLLEKTIONEN” filter functionality
**Test ID:** TC-PLP-12
**Steps:** 
1. Individually select each option under the “NACH KOLLEKTIONEN” filter, then click the “ALLES LÖSCHEN” button.
**Expected Result:**
The displayed products should remain unchanged since no filter has been selected.
---

## Test Case 13: Filter deny: “SORTIEREN NACH” filter functionality
**Test ID:** TC-PLP-13
**Steps:** 
1. Individually select each option under the “SORTIEREN NACH” filter, then click the “ALLES LÖSCHEN” button.
**Expected Result:**
The displayed products should remain unchanged since no filter has been selected.

## Test Case 14: PLP droppdown functionality
**Test ID:** TC-PLP-14
**Steps:** 
1. Click each option in dropdown and verify the list of products displayed.
**Expected Result:**
Each option should be clickable, and the corresponding list of products should be displayed. Show these products in the output.
---

## Test Case 15: Favorite icon functionality
**Test ID:** TC-PLP-15
**Steps:** 
1. Click the favorite icon on any product packshot.
**Expected Result:**
Verify the in header, favorite count should get increase
---

## Test Case 16: Verify the SEO components
**Test ID:** TC-PLP-16
**Steps:** 
1. Verify the SEO components, including Meta Title, Meta Description, OG Title, OG Description, Canonical URL, H1, H2, and H3.
**Expected Result:**
The specified SEO components should be displayed, and they must also appear in the output during execution.

