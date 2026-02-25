package ALP;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import Test_Report.HTML_Report.HtmlTestReport;

public class All_Articles_ALP {

public static void main(String[] args) throws InterruptedException, java.awt.AWTException, Exception {
Test_Report.HTML_Report HTML_ReportInstance = new Test_Report.HTML_Report();
HtmlTestReport report = HTML_ReportInstance.new HtmlTestReport();
System.setProperty("webdriver.chrome.driver", "C:\\Users\\Public\\Project Code\\chromedriver-win64\\chromedriver.exe");

    // Initialize WebDriver
    WebDriver driver = new ChromeDriver();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        
    // Maximize the browser window
    driver.manage().window().maximize();
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    report.addStep("Browser Initialization", "PASS", "✅ Browser initialized successfully");

    driver.get("https://www.gillette.de/de-de/perfekte-rasur");
    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10)); // Wait for page to load
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"wrap\"]/div[2]/div[2]/div/h1")));
    // Optionally, you can keep a short sleep if needed for extra stability
    Thread.sleep(2000);
    report.addStep("Page Load", "PASS", "✅ Article Listing Page loaded successfully. Page URL: " + driver.getCurrentUrl());

    // Wait for the Accept All Cookies button to be clickable
    WebElement acceptCookiesButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='onetrust-accept-btn-handler']")));
    acceptCookiesButton.click();
    Thread.sleep(5000); // Wait for cookies to be accepted
    report.addStep("Accept Cookies", "PASS", "✅ Cookies accepted successfully");

    //Verify Page Name
    WebElement pageTitle = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[2]/div[2]/div/h1"));
    String pageName = pageTitle.getText();
    System.out.println("Page Name: " + pageName);
    report.addStep("Article Listing Page Name", "DATA", "Page Name: " + pageName);

    //Verify Page Description
    WebElement pageDescription = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[2]/div[2]/div/p"));
    String description = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", pageDescription);
    System.out.println("Page Description: " + description);
    report.addStep("Article Listing Page Description", "DATA", "Page Description: " + description);

    // Example selector for article cards and titles (update as needed)
    List<WebElement> cards = driver.findElements(By.xpath("//*[@id=\"wrap\"]/div[3]/div[3]/ul/li"));
    System.out.println("Number of article cards found: " + cards.size());
    report.addStep("Number of Article Cards", "DATA", "Total Number of Article Cards present: " + cards.size());

    // Loop through each card and verify the article title
    int count = 1;
    while (count <= cards.size()) {
    // Store the current window handle before opening a new tab
    String articleWindow = driver.getWindowHandle();
    
    WebElement articleTitle = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[3]/div[3]/ul/li[" + (count) + "]/div/div/div/a"));
    String articleName = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", articleTitle);
    String articleLink = articleTitle.getAttribute("href");
    System.out.println("Article " + (count) + ": " + articleName + " (" + articleLink + ")");

    ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", articleLink);
    Thread.sleep(2000);

    // Switch to the new tab
    Set<String> allWindows = driver.getWindowHandles();
        for (String articleWindowHandle : allWindows) {
        if (!articleWindowHandle.equals(articleWindow)) {
            driver.switchTo().window(articleWindowHandle);
            Thread.sleep(4000);

            // Example: get the article name from the new page
            WebElement ADP_Article = driver.findElement(By.tagName("h1"));
            String ADP_articleName = (String) ((JavascriptExecutor) driver).executeScript("return arguments[0].innerText.replace(/\\s+/g, ' ').trim();", ADP_Article);

            if (ADP_articleName.equalsIgnoreCase(articleName)) {
                System.out.println("✅ Verified. Correct Article linked. Article: " + (count) + ": " + articleName);
                report.addStep("Verify Listed Article", "PASS", "✅ Correct Article is linked to Article Number " + (count) + ": " + articleName);
                Thread.sleep(5000);
            } else {
                System.out.println("❌ Mismatch: Card = " + articleName + ", Page = " + ADP_articleName);
                report.addStep("Verify Listed Article", "FAIL", "❌ Mismatch: Title on Card = " + articleName + ", Title on Article Page = " + ADP_articleName);
                }

                driver.close();
                driver.switchTo().window(articleWindow);
                break;
               }
            }
            Thread.sleep(5000);

            // ********** Verify the FAVORITE FUNCTIONALITY **********
            // Mark the article as favorite by clicking the favorite icon
            WebElement favoriteButton = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[3]/div[3]/ul/li[" + (count) + "]/div/div/div/button"));
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", favoriteButton);
            Thread.sleep(500);
            favoriteButton.click();
            Thread.sleep(4000); // Wait for the action to complete
            report.addStep("Select 'Favorite Icon'", "PASS", "✅ 'Favorite Icon' button clicked for Article: " + articleName + " successfully on Article Card.");

            // Verify if the article is marked as favorite (you may need to adjust the verification method based on the actual behavior)
            String fav_Window = driver.getWindowHandle();
            String fav_headerIcon = driver.findElement(By.xpath("//*[@id=\"heartIcon\"]")).getAttribute("href");
            ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", fav_headerIcon);
            Thread.sleep(5000);

            Set<String> favWindows = driver.getWindowHandles();
            for (String windowHandle : favWindows) {
            if (!windowHandle.equals(fav_Window)) {
            driver.switchTo().window(windowHandle);
            Thread.sleep(3000);
            WebElement fav_Article_menu = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[2]/div[2]/div/a[1]/span[1]/span"));
            fav_Article_menu.click();

            // Verify if the article is added to favorites
            boolean isAdded = !driver.findElements(By.xpath("//*[@id=\"wrap\"]/div[2]/div[3]/div/div/div/a/h3[contains(text(),articleName)]")).isEmpty();

            if (isAdded) {
            System.out.println("✅ The article has been successfully added.");
            report.addStep("Mark 'Favorite Article'", "PASS", "✅ The article has been successfully added to the favorites list. Added Article: " + articleName);
            } else {
            System.out.println("❌ The article is not present in the favorites list.");
            report.addStep("Mark 'Favorite Article'", "FAIL", "❌ The article '" + articleName + "' is not present in the favorites list.");
            }

            driver.close();
            driver.switchTo().window(fav_Window);
            break;
            }
        }

        Thread.sleep(5000);

        // Unmark the article as favorite by clicking the favorite icon again
        WebElement unfavoriteButton = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[3]/div[3]/ul/li[" + (count) + "]/div/div/div/button"));
        unfavoriteButton.click();
        Thread.sleep(4000); // Wait for the action to complete
        report.addStep("Uncheck Favorite Icon", "PASS", "✅ 'Favorite Icon' button clicked again to unmark the favorite for Article: " + articleName + " successfully.");

        // Verify if the article is unmarked as favorite

        String unfav_Window = driver.getWindowHandle();
        String unfav_headerIcon = driver.findElement(By.xpath("//*[@id=\"heartIcon\"]")).getAttribute("href");
        ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", fav_headerIcon);
        Thread.sleep(2000);

        Set<String> unfavWindows = driver.getWindowHandles();
        for (String windowHandle : unfavWindows) {
        if (!windowHandle.equals(unfav_Window)) {
            driver.switchTo().window(windowHandle);
            Thread.sleep(3000);
            WebElement fav_Article_menu = driver.findElement(By.xpath("//*[@id=\"wrap\"]/div[2]/div[2]/div/a[1]/span[1]/span"));
            fav_Article_menu.click();

        // Verify if the article is removed
        boolean isRemoved = driver.findElements(By.xpath("//*[@id=\"wrap\"]/div[2]/div[3]/div/div/div/a/h3[contains(text(),articleName)]")).isEmpty();

        if (isRemoved) {
            System.out.println("✅ The article has been successfully removed.");
            report.addStep("Unmark 'Favorite Article'", "PASS", "✅ The article has been successfully removed from the favorites list. Removed Article: " + articleName);
            } else {
            System.out.println("❌ The article is still present in the favorites list.");
            report.addStep("Unmark 'Favorite Article'", "FAIL", "❌ The article is still present in the favorites list.");
            }

        driver.close();
        driver.switchTo().window(fav_Window);
        break;
        }
    }

    count++;
    Thread.sleep(5000); // Wait before moving to the next card
    }

    // ********** Verify the drop-down functionality of "switching drop-down" **********
    
    WebElement dropdown = driver.findElement(By.xpath("//*[@id=\"dropdownButton\"]"));
    dropdown.click();
    Thread.sleep(2000);

    List<WebElement> options = driver.findElements(By.xpath("//*[@id=\"react-portal\"]/div[2]/div[2]/a"));
    int optionscount = options.size();
    int TotalOptions = optionscount - 1; // Exclude the first option
    System.out.println("Dropdown Count: " + TotalOptions);
    report.addStep("Dropdown Count", "DATA", "Total Number of Dropdown options are: " + TotalOptions);

    String currentALP = "Alle Artikel";
    List<String> titles = new ArrayList<>();

    // Store the titles of the options in a list, excluding "Alle Artikel"
    for (WebElement option : options) {
    String title = option.getAttribute("title");
    if (title != null && !title.equals(currentALP)) {
        titles.add(title);
        System.out.println("Option Title: " + title);
        }
    }
    report.addStep("Dropdown Options", "DATA", "Dropdown Options are: " + titles);

    String dropdownWindow = driver.getWindowHandle();

    for(int dropdowncount=1; dropdowncount<=TotalOptions; dropdowncount++) {
        String currentTitle = titles.get(dropdowncount - 1);

        // Skip the option with title "Alle Artikel"
        if (currentALP.equalsIgnoreCase(currentTitle)) {
        System.out.println("Skipping option: " + currentTitle);
        continue;
        }

        WebElement optionToSelect = driver.findElement(By.xpath("//*[@id=\"react-portal\"]/div[2]/div[2]/a[@title='" + currentTitle + "']"));
        String optionText = optionToSelect.getText();
        System.out.println("Selecting Option Text: " + optionText);
        String optionURL = optionToSelect.getAttribute("href");
        System.out.println("Selecting Option URL: " + optionURL);

        ((JavascriptExecutor) driver).executeScript("window.open(arguments[0]);", optionURL);
        Thread.sleep(3000);

        // Switch to the new tab
        Set<String> allWindows = driver.getWindowHandles();
        for (String articleWindowHandle : allWindows) {
        if (!articleWindowHandle.equals(dropdownWindow)) {
            driver.switchTo().window(articleWindowHandle);
            Thread.sleep(4000);

        String newPageURL = driver.getCurrentUrl();
        System.out.println("New Page URL: " + newPageURL);
        if(newPageURL.equals(optionURL)) {
        System.out.println("✅ Successfully navigated to the correct page: " + optionText);
        report.addStep("ALP Navigation from Drop-Down List: " + optionText, "PASS", "✅ Successfully navigated to the correct page. New ADP URL matches with hyperlinked URL. URL is: " + newPageURL);
        } else {
        System.out.println("❌ Navigation failed for: " + optionText);
        report.addStep("ALP Navigation from Drop-Down List: " + optionText, "FAIL", "❌ Navigation failed for: " + optionText);
        }

        driver.close();
        driver.switchTo().window(dropdownWindow);
        break;
        }
    }
    Thread.sleep(5000);
    }
    //close the dropdown pop-up
    WebElement dropdownclose = driver.findElement(By.xpath("//*[@id=\"react-portal\"]/div[2]/div[1]/button[2]"));
    dropdownclose.click();
    Thread.sleep(3000);
        report.addStep("Dropdown Navigation", "PASS", "✅ Dropdown pop-up is closed successfully and navigated back to the main page.");

    // Close the browser
    driver.quit();
    report.addStep("Browser Closed", "PASS", "✅ Browser closed successfully");

    // Report Generation
    try {
        report.generateReport("All_Articles_ALP.html");
        System.out.println("HTML report generated: For All Articles ALP");
    } catch (IOException e) {
        e.printStackTrace();
    }
}
}