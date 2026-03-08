# Write A Review - Manual Test Case

## Test Case Summary
Complete end-to-end manual test case for the "Write A Review" functionality on Gillette Germany website. This test validates the entire review submission workflow including form validation, file uploads, and success verification.

---

## Test Case Details

| Component | Description |
|-----------|-------------|
| **Test Case ID** | TC-WAR-001 |
| **Title** | Complete Review Submission Workflow |
| **Module** | Product Review Management System |
| **Test Scope** | End-to-End (E2E) Workflow |
| **Test Type** | Functional & Behavioral |
| **Priority Level** | High |

---

## System Requirements & Assumptions

### Environment
- User has access to a modern web browser
- User has an active internet connection
- Product review system is available and operational
- Test environment supports form submissions and file uploads

### Test Data Requirements
- Image file (various formats: JPG, PNG)
- Video file (MP4, AVI, or similar)
- Valid user information (email, location, etc.)
- No prior constraints on user review history

---

## Theoretical Test Workflow

### **Phase 1: System Access & Navigation**

#### Step 1: Application Entry
- **Objective**: Verify user can access the product catalog
- **Conceptual Requirements**:
  - Application loads without errors
  - Product listing/catalog is displayed
  - Navigation elements are functional

#### Step 2: Cookie & Consent Management
- **Objective**: Validate consent mechanism functionality
- **Conceptual Requirements**:
  - Consent banner appears and is dismissible
  - User can accept/decline terms
  - Consent state is respected on subsequent interactions

#### Step 3: Product Information Retrieval
- **Objective**: Ensure product details are accessible
- **Conceptual Requirements**:
  - Product name/identifier is displayed
  - Product information is readable and accurate
  - Review section is visible and accessible

#### Step 4: Review Interface Navigation
- **Objective**: Verify navigation to review submission form
- **Conceptual Requirements**:
  - "Write A Review" entry point is visible
  - Navigation to review form completes successfully
  - Form page loads with product context

#### Step 5: Cross-Page Validation
- **Objective**: Confirm context consistency across pages
- **Conceptual Requirements**:
  - Product identifier is consistent between pages
  - No data loss during navigation
  - Review form is correctly associated with product

---

### **Phase 2: Form Completion & Data Entry**

#### Step 6: Rating System
- **Objective**: Validate numeric rating mechanisms
- **Conceptual Requirements**:
  - Multiple rating scales are available (Overall, Value, Quality)
  - Rating selections are captured correctly
  - User can modify selections before submission
  - Rating selections persist on form

#### Step 7: Text Content Entry
- **Objective**: Verify text input fields and validation rules
- **Conceptual Requirements**:
  - Summary field accepts text input with maximum length constraint
  - Description field accepts text input with range constraints (min-max)
  - Character counting/validation works correctly
  - Form prevents submission of invalid text data

#### Step 8: Media Upload Capability (MANDATORY)
- **Objective**: Validate file upload functionality for multiple media types
- **Conceptual Requirements**:
  - Photo upload field is available and functional
  - Video upload field is available and functional
  - Both file uploads are required (mandatory validation)
  - File type validation is enforced
  - File size constraints are applied
  - Upload progress is indicated to user
  - Uploaded files display preview/thumbnail
  - Form prevents submission without both media files

#### Step 9: User Profile Information
- **Objective**: Collect and validate personal information
- **Conceptual Requirements**:
  - Nickname field accepts strings within length constraints (4-20 chars)
  - Date of birth collection with month/year selectors
  - Age validation enforced (minimum age threshold)
  - Gender selection from predefined options
  - Email input with format validation
  - Location/country selection from list
  - All fields properly store input values

#### Step 10: Legal Compliance
- **Objective**: Verify terms and conditions acceptance
- **Conceptual Requirements**:
  - Terms & Conditions checkbox is available
  - Checkbox state (checked/unchecked) is trackable
  - Form validates checkbox is checked before submission
  - User cannot submit without accepting terms

---

### **Phase 3: Form Submission & Verification**

#### Step 11: Submit Action
- **Objective**: Verify form submission process
- **Conceptual Requirements**:
  - Submit button is accessible and functional
  - Form validates all required fields before submission
  - Submission triggers server-side processing
  - User receives submission confirmation/acknowledgment
  - Form prevents duplicate submissions

#### Step 12: Success Validation
- **Objective**: Confirm successful submission
- **Conceptual Requirements**:
  - Success message is displayed to user
  - Message indicates review was submitted successfully
  - Message contains no error indicators
  - Confirmation persists until user dismisses/continues
  - User has option to proceed (continue button)

#### Step 13: Post-Submission Navigation
- **Objective**: Verify user is redirected appropriately
- **Conceptual Requirements**:
  - Navigation back to original product page is possible
  - Product page loads successfully after review submission
  - Previously entered review is visible in product reviews list
  - User state is properly maintained post-submission

---

## Validation Rules & Business Logic

### Form Field Constraints
| Field | Type | Min Length | Max Length | Required | Validation |
|-------|------|-----------|-----------|----------|-----------|
| Summary | Text | 1 | 50 | Yes | Character limit enforcement |
| Description | Text | 50 | 200 | Yes | Character range enforcement |
| Nickname | Text | 4 | 20 | Yes | Length validation |
| Birth Month | Select | - | - | Yes | Valid month required |
| Birth Year | Select | - | - | Yes | Age >= 22 years validation |
| Gender | Select | - | - | Yes | Valid option required |
| Email | Text | - | - | Yes | Format validation (RFC 5322) |
| Location | Text/Select | 1 | 100 | Yes | Non-empty validation |
| Photo | File | - | 10MB | Yes (Mandatory) | Type & size validation |
| Video | File | - | 100MB | Yes (Mandatory) | Type & size validation |
| Terms | Checkbox | - | - | Yes | Must be checked |

### Rating System Specifications
| Rating Type | Scale | Required | Selection |
|-------------|-------|----------|-----------|
| Overall | 1-5 Stars | Yes | Single selection |
| Value | 1-5 Stars | Yes | Single selection |
| Quality | 1-5 Stars | Yes | Single selection |
| Recommendation | Yes/No | Yes | Boolean selection |

---

## Expected Business Outcomes

### User Workflow Completion
- ✅ User successfully navigates through complete review workflow
- ✅ All form fields are properly validated
- ✅ Multi-media files are uploaded without errors
- ✅ Data is correctly stored and retrievable
- ✅ Success confirmation is provided
- ✅ User returns to product page with review visible

### System Behavior
- ✅ No data loss during form submission
- ✅ Consistent error handling for validation failures
- ✅ Appropriate user feedback for all actions
- ✅ Secure file upload handling
- ✅ Proper GDPR/privacy compliance
- ✅ Database persistence of review data

---

## Test Coverage Matrix

| Functional Area | Test Scenarios |
|-----------------|---|
| **Navigation** | Page access, cross-page transitions, back navigation |
| **Form Fields** | Input validation, constraint enforcement, field state |
| **Ratings** | Selection accuracy, modification capability, persistence |
| **Text Input** | Character limits, format validation, special characters |
| **File Uploads** | Type validation, size limits, dual file requirement |
| **Personal Info** | Dropdown selection, age validation, format validation |
| **Submission** | Mandatory field checking, duplicate prevention, processing |
| **Verification** | Success message accuracy, data retrieval, visibility |
| **Error Handling** | Invalid input handling, network failures, timeout scenarios |

---

## Theoretical Assumptions & Scope Limitations

### In Scope
- Single user workflow (non-concurrent)
- Happy path scenario (valid data entry)
- Standard browser environment
- Normal network conditions
- English/German language support

### Out of Scope
- Concurrent user submissions
- Performance load testing
- Security penetration testing
- Browser compatibility testing (assumed tested separately)
- Internationalization beyond German language
- Multi-language UI testing

---

## Test Execution Considerations

### Prerequisites Verification
- Browser environment verification
- Network connectivity confirmation
- Test data availability check
- System readiness confirmation

### Observation Points
- Form validation error messages
- File upload progress indicators
- Network response times
- User feedback mechanisms
- Session state management
- Data persistence confirmation

---

## Automation Capability Assessment

| Component | Automation | Manual | Notes |
|-----------|-----------|--------|-------|
| Navigation | ✅ High | - | Element-based automation possible |
| Form Input | ✅ High | - | Straightforward input automation |
| File Upload | ✅ Medium | ✅ Required | File path handling complexity |
| Validation | ✅ High | - | Assertion-based verification |
| Success Message | ✅ High | - | Text content verification |
| Workflow Sequencing | ✅ High | - | Step-by-step execution automation |

---

## Theory-to-Practice Mapping

This theoretical test case establishes:
1. **Conceptual requirements** for a review submission system
2. **Validation rules** independent of UI implementation
3. **Business logic** requirements
4. **Data constraints** applicable across platforms
5. **Workflow steps** that translate to automated test cases

The actual implementation (Playwright, Selenium, etc.) may vary, but the theoretical foundation remains consistent across different automation frameworks and technologies.

