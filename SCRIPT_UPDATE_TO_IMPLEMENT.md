# Comprehensive Script Updates Required (Per MD File)

## ✅ Completed Updates:
1. **Browser Context**: Added 150% display scaling (`deviceScaleFactor: 1.5`)
2. **TC-PLP-02**: Added pagination handling with scroll detection

## ⚠️ Pending Major Updates:

### 1. TC-PLP-03 & TC-PLP-04 MUST BE MERGED
**Current Implementation**: Two separate tests
**Required Implementation**: Single combined loop per MD:
- For Product 1:
  - Execute JETZT KAUFEN flow (TC-PLP-03)
  - Wait 5 seconds after variant selected
  - Click JETZT KAUFEN again for retailers popup
  - Test all variants
  - Close popup
  - Execute MEHR ERFAHREN flow (TC-PLP-04)
  - Navigate back
- Repeat for ALL products

### 2. TC-PLP-05: Product Story Default Expanded State
**Required**: First story expanded by default, display content, close. Remaining stories: expand, display, close.

### 3. TC-PLP-06: FAQ Display Question + Answer
**Required**: For each FAQ - expand, display question text, display answer content, then collapse.

### 4. Filter Tests (TC-PLP-09 to TC-PLP-12): Add Removal Flow
**Required for each filter option**:
- Select filter option
- Click ANWENDEN
- Verify filter tag appears
- **Click X on filter tag to remove**
- Verify all products reappear

## Implementation Notes:
- Test execution must be: TC-PLP-03 (JETZT KAUFEN) THEN TC-PLP-04 (MEHR ERFAHREN) for EACH product
- Not two separate loops - ONE loop with both tests per product
- Pagination must be handled throughout product testing

## Playwright Best Practices to Apply:
- Use `page.locator().filter()` for precise element selection
- Use `scrollIntoViewIfNeeded()` before all clicks
- Use `waitForLoadState('networkidle')` for dynamic content
- Add proper timing for animations (1000-2000ms)
