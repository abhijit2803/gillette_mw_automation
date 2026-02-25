package PDP;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.Iterator;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import Test_Report.HTML_Report.HtmlTestReport;

public class Gel_Foams_PDP_Sanity {

public static void main(String[] args) throws java.io.IOException, InterruptedException, java.awt.AWTException, Exception{
Test_Report.HTML_Report HTML_ReportInstance = new Test_Report.HTML_Report();
HtmlTestReport report = HTML_ReportInstance.new HtmlTestReport();

// Path to the Excel file containing URLs
String excelFilePath = "C:\\Users\\Public\\Project Code\\Germany\\Gels_Foams_URLs_Germany.xlsx"; // Update with your actual path

try (FileInputStream fis = new FileInputStream(new File(excelFilePath));
    Workbook workbook = new XSSFWorkbook(fis)) {

    Sheet sheet = workbook.getSheetAt(0);

    int urlCount = 0;
    for (Row row : sheet) {
        Cell cell = row.getCell(0); // Assuming URLs are in the first column
        if (cell != null && cell.getCellType() == CellType.STRING && !cell.getStringCellValue().trim().isEmpty()) {
            urlCount++;
            }
        }
        System.out.println("Total number of URLs: " + urlCount);
        report.addStep("URL Count", "INFO", "Total number of King C. Gillette Product URLs for sanity: " + urlCount);

        Iterator<Row> rowIterator = sheet.iterator();
        System.out.println("Reading URLs from Excel:");

        int count=1;
        while (count <= urlCount) {
            while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Cell cell = row.getCell(0); // Assuming URLs are in the first column

            if (cell != null) {
                    
            // Set the path to the Chrome Driver executable
            System.setProperty("webdriver.chrome.driver", "C:\\Users\\Public\\Project Code\\chromedriver-win64\\chromedriver.exe");

            // Launch browser
            WebDriver driver = new ChromeDriver();
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            report.addStep("Browser Initialization", "PASS", "✅ Browser initialized successfully for " + count + " time");

            // Maximize the browser window
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

            String url = cell.getStringCellValue();
            System.out.println("Launching: " + url);
            report.addStep("Launch URL", "INFO", "Launching Product URL Number " + count + " from input file: " + url);

            // Navigate to the target URL
            System.out.println("Navigating to: " + url);
            driver.get(url);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10)); // Wait for page to load
            report.addStep("Navigate to URL" , "PASS", "✅ Navigated to URL: " + count + " " + url);

            // Wait for the Accept All Cookies button to be clickable
            WebElement acceptCookiesButton = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='onetrust-accept-btn-handler']"))
            );

            // Click the Accept All Cookies button
            acceptCookiesButton.click();
            Thread.sleep(2000); // Wait for cookies to be accepted
            report.addStep("Cookies", "PASS", "✅ Cookies accepted successfully");
                    
            // Validate current URL
            String currentUrl = driver.getCurrentUrl();
            System.out.println("Current URL: " + currentUrl);
            // If you want to compare with the expected URL, declare expectedUrl or use urlParts
            if (currentUrl.equals(url)) {
            System.out.println("✅ URL loaded successfully: " + currentUrl);
            report.addStep("Navigated to product page", "PASS", "✅ URL Number " + count + " loaded successfully and matches with input product URL. The URL is: " + currentUrl);
            } else {
            System.out.println("❌ URL did not load as expected. Expected: " + url + ", but got: " + currentUrl);
            report.addStep("Navigated to product page", "FAIL", "❌ URL Number " + count + " did not match with input data. Expected: " + url + ", but got: " + currentUrl);
            }
            
            String productName = "";
            // Verify H1 tag
            try {
                WebElement h1 = driver.findElement(By.tagName("h1"));
                productName = h1.getText();
                System.out.println("Product Name: " + productName);
                report.addStep("Product Name", "PASS", "✅ Product Name of product number " + count + ": " + productName);
                } catch (Exception e) {
                System.out.println("Product Name not found on: " + url);
                report.addStep("Product Name", "FAIL", "❌ Product Name of product number " + count + " is not found on: " + url);
            }
                Thread.sleep(5000);

            // Store the main window handle before any popup is opened
            String mainWindow = driver.getWindowHandle();

            //Verify Facebook Functionality
            String fb_message = "https://www.gillette.de/";
            WebElement fb_iconElement = driver.findElement(By.id("imgBtnFacebook"));
            fb_iconElement.click();
            Thread.sleep(3000); // Wait for the popup to load

            // Handle pop-up window
            for (String handle : driver.getWindowHandles()) {
                if (!handle.equals(mainWindow)) {
                driver.switchTo().window(handle);
                break;
                }
            }

        try {
            WebElement fb_successMsgElement = driver.findElement(By.xpath("//*[@id=\"overview\"]/div/div/div[2]/div[1]/div/div[2]/div/div/div[1]/div/div/div/div[1]/div/div/div[2]/a"));
            String fb_expectedmessage = fb_successMsgElement.getText();
            fb_expectedmessage = (String) ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", fb_successMsgElement);

        if (fb_message.equals(fb_expectedmessage)) {
            System.out.println("✅ Success message verified. Success message matches with expected text.");
            report.addStep("Click 'Facebook Icon'", "PASS", "✅ 'Facebook Icon' button clicked.");
            } else {
            System.out.println("❌ Success message not found. Success message does not match expected text.");
            report.addStep("Click 'Facebook Icon'", "FAIL", "❌ 'Facebook Icon' button clicked.");
            }
        System.out.println("Actual message: " + fb_successMsgElement.getText());
        } catch (Exception e) {
        // Optionally, you can print the title if needed:
        System.out.println("Fallback title: " + driver.getTitle());
        }

        //Close Facebook popup
        WebElement fb_closeButton = driver.findElement(By.xpath("//*[@id=\"closeButton\"]/span"));
        fb_closeButton.click();

        // Switch back to the main window after closing the popup
        driver.switchTo().window(mainWindow);

        // Verify Copy URL Functionality
        String copy_URL = "";
        WebElement copy_iconElement = driver.findElement(By.id("imgBtncopyLink"));
        copy_iconElement.click();
        Thread.sleep(5000); // Wait for the popup to load

        // Handle pop-up window
        for (String handle : driver.getWindowHandles()) {
            if (!handle.equals(mainWindow)) {
                driver.switchTo().window(handle);
                break;
            }
        }

        WebElement copyButtonElement = driver.findElement(By.id("copyLink"));
        Thread.sleep(2000); // Wait for the copy action to complete
        copy_URL = copyButtonElement.getAttribute("value");
        Thread.sleep(2000); // Wait for the copy action to complete
        System.out.println("Copied URL: " + copy_URL);

        if (copy_URL.contains(currentUrl)) {
        System.out.println("✅ Copy URL functionality works & matches with current URL. Copied URL: " + copy_URL);
        report.addStep("Click 'Copy Icon'", "PASS", "✅ 'Copy Icon' button clicked.");
        } else {
        System.out.println("❌ Copy URL functionality failed. Copied URL does not match with current URL.");
        report.addStep("Click 'Copy Icon'", "FAIL", "❌ 'Copy Icon' button not clicked.");
    }

    //Close Copy URL popup
    try {
        WebElement copy_closeButton = driver.findElement(By.xpath("//*[@id=\"closeButton\"]/span"));
        copy_closeButton.click();
        System.out.println("Copy URL popup closed successfully.");
        } catch (Exception e) {
        System.out.println("Close button not found or could not close Copy URL popup.");
    }
    // Switch back to the main window after closing the popup
    driver.switchTo().window(mainWindow);

    //Verify Favorite Functionality
    String fav_Window = driver.getWindowHandle(); // Store the main window handle before opening favorite popup
    WebElement fav_iconElement = driver.findElement(By.xpath("//*[@id=\"overview\"]/div/div/div[2]/div[1]/div/div[2]/button"));
    fav_iconElement.click();
    String fav_headerIcon = driver.findElement(By.xpath("//*[@id=\"heartIcon\"]")).getAttribute("href");
    ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", fav_headerIcon);
    Thread.sleep(2000);

    Set<String> favWindows = driver.getWindowHandles();
    for (String windowHandle : favWindows) {
        if (!windowHandle.equals(fav_Window)) {
        driver.switchTo().window(windowHandle);
        Thread.sleep(3000);
        WebElement fav_Product_menu = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[2]/div[2]/div/a[2]/span[1]/span"));
        fav_Product_menu.click();

        String fav_ProductName = driver.findElement(By.xpath("//*[@id=\"product-undefined\"]/div/div/a")).getText();

        if (productName.equalsIgnoreCase(fav_ProductName)) {
        System.out.println("✅ Correct Product linked. Product: " + fav_ProductName);
        report.addStep("Click 'Favorite Icon'", "PASS", "✅ 'Favorite Icon' button clicked.");
        } else {
        System.out.println("❌ Mismatch: Card = " + productName + ", Page = " + fav_ProductName);
        report.addStep("Click 'Favorite Icon'", "FAIL", "❌ 'Favorite Icon' button not clicked.");
        }

        driver.close();
        driver.switchTo().window(fav_Window);
        break;
        }
    }

    //Verify BUY NOW button functionality
    String pop_upmsg = "Online-Händler";
    String BuyNow_Window = driver.getWindowHandle();
    WebElement buynowButton = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"shopnowBtn-container\"]/div/span[2]"))
    );
    buynowButton.click();
    Thread.sleep(5000); // Wait for the popup to load

    // Handle pop-up window
    for (String handle : driver.getWindowHandles()) {
        if (!handle.equals(BuyNow_Window)) {
        driver.switchTo().window(handle);
        break;
       }
    }

    try {
    WebElement buynow_successMsgElement = driver.findElement(By.xpath("/html/body/div[5]/div/div[6]/div[1]/h2"));
    String buynow_expectedmessage = buynow_successMsgElement.getText();
    //buynow_expectedmessage = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", buynow_successMsgElement);

    if (pop_upmsg.equals(buynow_expectedmessage)) {
        System.out.println("✅ Success message verified. Success message matches with expected text.");
        report.addStep("Click 'Buy Now Button'", "PASS", "✅ 'Buy Now Button' button is successfully clicked. The Verified message on pop-up is: " + buynow_expectedmessage);
    } else {
        System.out.println("❌ Success message not found. Success message does not match expected text.");
        report.addStep("Click 'Buy Now Button'", "FAIL", "❌ 'Buy Now Button' button not clicked.");
    }
    System.out.println("Actual message: " + buynow_successMsgElement.getText());
    } catch (Exception e) {
    // Optionally, you can print the title if needed:
    System.out.println("Fallback title: " + driver.getTitle());
    }
    Thread.sleep(5000); 

    //Close BUY Now popup
    WebElement buynow_closeButton = driver.findElement(By.xpath("/html/body/div[5]/div/span[1]"));
    buynow_closeButton.click();

    // Switch back to the main window after closing the popup
    driver.switchTo().window(BuyNow_Window);

   // Move mouse away from header to avoid hover
   WebElement safeArea = driver.findElement(By.xpath("//*[@id=\"overview\"]/div/div/div[2]/div[3]/p")); // or any element away from header
   Actions actions = new Actions(driver);
   actions.moveToElement(safeArea).perform();

   // Wait for header dropdown to disappear
   wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("headerBackdrop")));

   // Verify Menu Click Functionality
   // Verify Feature Section click functionality
   WebElement featureSectionButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"inner-tabs\"]/button[1]")));
    featureSectionButton.click();
    Thread.sleep(2000); // Wait for the feature section to load
    WebElement featureSection = driver.findElement(By.xpath("//*[@id=\"feature\"]/div[1]/div[1]"));
    if (featureSection.isDisplayed()) {
        String featureSectionTitle = featureSection.getText();
        System.out.println("✅ Feature Section title is correct: " + featureSectionTitle);
        report.addStep("Click 'Feature Section' from MENU list", "PASS", "✅ 'Feature Section' option is clicked from the MENU List and page scrolls to FEATURE section. The first feature heading is: " + featureSectionTitle);
    } else {
        System.out.println("❌ Feature Section title is incorrect: " + featureSection.getText());
        report.addStep("Click 'Feature Section' from MENU list", "FAIL", "❌ 'Feature Section' not clicked.");
    }

    // Verify Review Section click functionality
    String reviewButtonTitle = "BEWERTUNG SCHREIBEN";
    WebElement reviewSection = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"inner-tabs\"]/button[2]")));
    reviewSection.click();
    Thread.sleep(4000); // Wait for the review section to load
    String reviewSectionTitle = driver.findElement(By.xpath("//*[@id=\"review\"]/div/div/div/a/span[1]")).getText();
    if (reviewSectionTitle.contains(reviewButtonTitle)) {
        System.out.println("✅ Review Section title is correct: " + reviewSectionTitle);
        report.addStep("Click 'Review Section' from MENU list", "PASS", "✅ 'Review Section' option is clicked from the MENU List and page scrolls to REVIEW section.");
    } else {
        System.out.println("❌ Review Section title is incorrect: " + reviewSectionTitle);
        report.addStep("Click 'Review Section' from MENU list", "FAIL", "❌ 'Review Section' not clicked.");
    }

    // ********** Validate Write A Review Button & Page **********
    // Verify the "Write A Review" button

    WebElement writeReviewButton = driver.findElement(By.xpath("//*[@id=\"review\"]/div/div/div[1]/a"));
    if (writeReviewButton.isDisplayed()) {
    System.out.println("'Write A Review' button is found.");
    report.addStep("Write A Review Button", "PASS", "✅ 'Write A Review' Button is found for Product Number " + count);
    // Wait for potential new window/tab or page change
    Thread.sleep(3000);
    } else {
    System.out.println("'Write A Review' button not found.");
    report.addStep("Write A Review Button", "FAIL", "❌ 'Write A Review' Button is NOT found for Product Number " + count);
    }

    // Click the Write A Review button
    System.out.println("Clicking on 'Write A Review' button...");
    writeReviewButton.click();
    //js.executeScript("arguments[0].click();", writeReviewButton);
    report.addStep("Write A Review Button", "PASS", "✅ 'Write A Review' Button is found for Product Number " + count + " and clicked successfully.");

    // Validate Write A Review URL
    String reviewUrl = driver.getCurrentUrl();
    System.out.println("Review Page URL: " + reviewUrl);

    // Extract product name from H1 or title
    String productName_WAR;
    try {
        WebElement h1Tag = driver.findElement(By.tagName("h1"));
        productName_WAR = h1Tag.getText();
        } catch (Exception e) {
        productName_WAR = driver.getTitle();
        }

        System.out.println("Extracted Product Name in Write A Review Page: " + productName_WAR);

        // Validate product name on review page

        if (productName_WAR.equals(productName)) {
        System.out.println("Product name is correctly displayed on the review page.");
        report.addStep("Write A Review Page", "PASS", "✅ 'Write A Review' Page is successfully displayed for Product Number " + count + ". The Product name on review page is: " + productName_WAR); 
        } else {
        System.out.println("Product name is NOT found on the review page.");
        report.addStep("Write A Review Page", "FAIL", "❌ 'Write A Review' Page is NOT displayed for Product Number " + count + ". The Product name on review page is: " + productName_WAR);
        }

        //Click on CANCEL button on Write A Review section to return to PDP
        WebElement cancelButton = driver.findElement(By.xpath("//*[@id=\"main-content\"]/div/div[2]/div[2]/div/form/div[1]/div[8]/a"));
        cancelButton.click();
        Thread.sleep(3000); // Wait for the page to load
        if (driver.getCurrentUrl().equals(currentUrl)) {
        System.out.println("✅ 'Cancel' Button is clicked, and returned to PDP page successfully.");
        report.addStep("Cancel Button", "PASS", "✅ 'Cancel' Button is clicked on WRITE A REVIEW page for Product Number " + count + " and returned to corresponding PRODUCT page successfully.");
        } else {
        System.out.println("❌ 'Cancel' Button is NOT clicked, and did not return to PDP page.");
        report.addStep("Cancel Button", "FAIL", "❌ 'Cancel' Button is NOT clicked for Product Number " + count);
        }
    
    Thread.sleep(5000);

    
    // ********** VERIFY THE RELATED PRODUCTS SECTION **********
    // Verify the products linked in related products section
    String originalWindow = driver.getWindowHandle();

    for (int i = 1; i <= 3; i++) {
        WebElement relatedProductname = driver.findElement(By.xpath("//*[@id=\"related-products-container\"]/div/div[1]/div/div/div[" + i + "]/div/div/div/a/div[2]/h3"));
        WebElement relatedProductLink = driver.findElement(By.xpath("//*[@id=\"related-products-container\"]/div/div[1]/div/div/div[" + i + "]/div/div/div/a"));
        String productTitle = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", relatedProductname);
        String productLink = relatedProductLink.getAttribute("href");

    ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", productLink);
    Thread.sleep(5000);

    Set<String> allWindows = driver.getWindowHandles();
    for (String windowHandle : allWindows) {
        if (!windowHandle.equals(originalWindow)) {
        driver.switchTo().window(windowHandle);
        Thread.sleep(5000);

        String PDP_ProductName = driver.findElement(By.tagName("h1")).getText();

        if (productTitle.equalsIgnoreCase(PDP_ProductName)) {
        System.out.println("✅ Correct Product linked. Product: " + productTitle);
        report.addStep("Verify Related Product", "PASS", "✅ Product linked at " + i + " position: " + productTitle);
        } else {
        System.out.println("❌ Mismatch: Card = " + productTitle + ", Page = " + PDP_ProductName);
        report.addStep("Verify Related Product", "FAIL", "❌ Mismatch: Card = " + productTitle + ", Page = " + PDP_ProductName);
        }

        driver.close();
        driver.switchTo().window(originalWindow);
        break;
        }
    }
}

    Thread.sleep(10000);

    //Verify the articles linked in related articles section
    String originalWindowArticle = driver.getWindowHandle();

    for (int j = 1; j <= 3; j++) {
        WebElement relatedArticleName = driver.findElement(By.xpath("//*[@id=\"related-articles-container\"]/div/div/div/div/div[" + j + "]/div/div/a/div/div[2]/a[1]/h3"));
        //*[@id="related-articles-container"]/div/div/div/div/div[1]/div/div/a/div/div[2]/a[1]/h3
        //*[@id="related-articles-container"]/div/div/div/div/div[2]/div/div/a/div/div[2]/a[1]/h3
        WebElement relatedArticleLink = driver.findElement(By.xpath("//*[@id=\"related-articles-container\"]/div/div/div/div/div[" + j + "]/div/div/a/div/div[2]/a[2]"));
        String articleTitle = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", relatedArticleName);
        String articleLink = relatedArticleLink.getAttribute("href");

        ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", articleLink);
        Thread.sleep(2000);

        Set<String> articleWindows = driver.getWindowHandles();
        for (String windowHandle : articleWindows) {
            if (!windowHandle.equals(originalWindowArticle)) {
            driver.switchTo().window(windowHandle);
            Thread.sleep(3000);

            WebElement PDP_ArticleName = driver.findElement(By.tagName("h1"));
            String PDP_articleTitle = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", PDP_ArticleName);

            if (articleTitle.equalsIgnoreCase(PDP_articleTitle)) {
                System.out.println("✅ Correct Article linked. Article: " + articleTitle);
                report.addStep("Verify Related Article", "PASS", "✅ Article linked at " + j + " position: " + articleTitle);
                } else {
                System.out.println("❌ Mismatch: Card = " + articleTitle + ", Page = " + PDP_articleTitle);
                report.addStep("Verify Related Article", "FAIL", "❌ Mismatch: Card = " + articleTitle + ", Page = " + PDP_articleTitle);
                }

            driver.close();
            driver.switchTo().window(originalWindowArticle);
            break;
            }
        }
    }

    // Close browser
    driver.quit();
    report.addStep("Close Browser", "PASS", "✅ Browser closed successfully for " + count + " time");

    // Report Generation
    try {
        report.generateReport("Gels_Foams_Sanity_Report.html");
        System.out.println("HTML report generated: For Gels & Foams Sanity Check");
        } catch (IOException e) {
        e.printStackTrace();
        }
        count++;
        }
    }
}
}
}
}