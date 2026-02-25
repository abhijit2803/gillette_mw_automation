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