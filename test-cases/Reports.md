package Test_Report;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class HTML_Report {
public class HtmlTestReport {

    class TestStep {
        String description;
        String status; // "PASS" or "FAIL"
        String details;

        TestStep(String description, String status, String details) {
            this.description = description;
            this.status = status;
            this.details = details;
        }
    }

    private List<TestStep> steps = new ArrayList<>();

    public void addStep(String description, String status, String details) {
        steps.add(new TestStep(description, status, details));
    }

    public void generateReport(String filePath) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("<html><head><title>Test Report</title>");
            writer.write("<style>table{border-collapse:collapse;}td,th{border:1px solid #ccc;padding:8px;}th{background:#eee;}</style>");
            writer.write("</head><body>");
            writer.write("<h1>AUTOMATION TEST REPORT - GILLETTE MODERN WEB MARKETS</h1>");
            writer.write("<p>Generated On Date: " + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy")) + "</p>");
            writer.write("<p>Generated On Time: " + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")) + "</p>");
            //writer.write("<p>Tested By: " + System.getProperty("user.name") + "</p>");
            writer.write("<p>Tested By: " + "ABHIJIT DUTTA" + "</p>"); // Replace with actual tester name if needed
            writer.write("<table>");
            writer.write("<tr><th>TEST STEPS</th><th>TEST STATUS</th><th>TEST DETAILS</th></tr>");
            int i = 1;
            for (TestStep step : steps) {
                String color;
                String statusIcon;
                String statusText;
                if ("INFO".equals(step.status)) {
                    color = "#FFFFED";
                    statusIcon = "ℹ️";
                    statusText = "INFO";
                } else if ("PASS".equals(step.status)) {
                    color = "#c8e6c9";
                    statusIcon = "✅";
                    statusText = "PASS";
                } else if ("FAIL".equals(step.status)) {
                    color = "#ffcdd2";
                    statusIcon = "❌";
                    statusText = "FAIL";
                } else {
                    color = "#ffffffff"; // Default color for other status
                    statusIcon = "";
                    statusText = step.status;
                }
                
                writer.write("<tr style='background:" + color + "'>");
                writer.write("<td>" + i++ + ". " + step.description + "</td>");
                writer.write("<td>" + statusIcon + " " + statusText + "</td>");
                writer.write("<td>" + step.details + "</td>");
                writer.write("</tr>");
            }
            writer.write("</table>");
            writer.write("</body></html>");
        }
    }
}
}