/**
 * HTML Test Report Generator
 * Generates beautiful HTML test reports for Playwright tests
 * 
 * Enhanced for JavaScript/Playwright
 * Enhanced with better UI and additional details
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test Step class to store individual test step information
 */
class TestStep {
  constructor(description, status, details, timestamp = new Date()) {
    this.description = description;
    this.status = status; // "PASS", "FAIL", "INFO", "WARNING", "SKIP"
    this.details = details;
    this.timestamp = timestamp;
  }
}

/**
 * HTML Test Report Generator Class
 */
export class HtmlTestReport {
  constructor(options = {}) {
    this.steps = [];
    this.testName = options.testName || 'Test Suite';
    this.environment = options.environment || 'Production';
    this.browser = options.browser || 'Chromium';
    this.baseUrl = options.baseUrl || '';
    this.testerName = options.testerName || 'ABHIJIT DUTTA';
    this.startTime = new Date();
    this.endTime = null;
    this.screenshots = [];
  }

  /**
   * Create HtmlTestReport with common configuration
   * @param {string} testName - Name of the test suite
   * @param {string} testEnvironment - Environment from setupTest (e.g., 'prod', 'qa') or 'Production' for beforeAll
   * @param {Object} [page] - Optional Playwright page object to extract baseURL
   * @returns {HtmlTestReport} Configured HTML report instance
   */
  static create(testName, testEnvironment, page = null) {
    // Extract baseURL from page context if available, otherwise use default
    let baseUrl = 'https://www.gillette.de';
    if (page && page.context && page.context()._options?.baseURL) {
      baseUrl = page.context()._options.baseURL;
    }
    
    return new HtmlTestReport({
      testName: testName,
      environment: testEnvironment.toUpperCase ? testEnvironment.toUpperCase() : testEnvironment,
      browser: 'Chromium',
      baseUrl: baseUrl,
      testerName: 'ABHIJIT DUTTA'
    });
  }

  /**
   * Add a test step to the report
   * @param {string} description - Step description
   * @param {string} status - Step status (PASS, FAIL, INFO, WARNING, SKIP)
   * @param {string} details - Additional details
   */
  addStep(description, status, details = '') {
    this.steps.push(new TestStep(description, status.toUpperCase(), details));
  }

  /**
   * Add an INFO step
   */
  addInfo(description, details = '') {
    this.addStep(description, 'INFO', details);
  }

  /**
   * Add a PASS step
   */
  addPass(description, details = '') {
    this.addStep(description, 'PASS', details);
  }

  /**
   * Add a FAIL step
   */
  addFail(description, details = '') {
    this.addStep(description, 'FAIL', details);
  }

  /**
   * Add a WARNING step
   */
  addWarning(description, details = '') {
    this.addStep(description, 'WARNING', details);
  }

  /**
   * Add a SKIP step
   */
  addSkip(description, details = '') {
    this.addStep(description, 'SKIP', details);
  }

  /**
   * Add a screenshot reference
   * @param {string} screenshotPath - Path to screenshot
   * @param {string} description - Screenshot description
   */
  addScreenshot(screenshotPath, description = '') {
    this.screenshots.push({ path: screenshotPath, description });
  }

  /**
   * Get status statistics
   */
  getStatistics() {
    const stats = {
      total: this.steps.length,
      pass: 0,
      fail: 0,
      info: 0,
      warning: 0,
      skip: 0
    };

    for (const step of this.steps) {
      switch (step.status) {
        case 'PASS': stats.pass++; break;
        case 'FAIL': stats.fail++; break;
        case 'INFO': stats.info++; break;
        case 'WARNING': stats.warning++; break;
        case 'SKIP': stats.skip++; break;
      }
    }

    stats.passRate = stats.total > 0 ? ((stats.pass / (stats.pass + stats.fail)) * 100).toFixed(1) : '0';
    return stats;
  }

  /**
   * Format date to readable string
   */
  formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Format time to readable string
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Calculate duration between two dates
   */
  calculateDuration(start, end) {
    const diff = end - start;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  /**
   * Get status icon and color
   */
  getStatusStyle(status) {
    const styles = {
      'INFO': { icon: 'ℹ️', color: '#e3f2fd', textColor: '#1565c0', badge: '#2196f3' },
      'PASS': { icon: '✅', color: '#e8f5e9', textColor: '#2e7d32', badge: '#4caf50' },
      'FAIL': { icon: '❌', color: '#ffebee', textColor: '#c62828', badge: '#f44336' },
      'WARNING': { icon: '⚠️', color: '#fff8e1', textColor: '#f57f17', badge: '#ff9800' },
      'SKIP': { icon: '⏭️', color: '#f3e5f5', textColor: '#7b1fa2', badge: '#9c27b0' }
    };
    return styles[status] || styles['INFO'];
  }

  /**
   * Generate the HTML report
   * @param {string} filePath - Path to save the report
   */
  async generateReport(filePath) {
    this.endTime = new Date();
    const stats = this.getStatistics();
    const duration = this.calculateDuration(this.startTime, this.endTime);
    const overallStatus = stats.fail > 0 ? 'FAILED' : 'PASSED';
    const overallColor = stats.fail > 0 ? '#f44336' : '#4caf50';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${this.testName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .report-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            overflow: hidden;
            margin-bottom: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            padding: 30px 40px;
        }
        
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo-icon {
            width: 50px;
            height: 50px;
            background: transparent;
            border-radius: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .logo-text h1 {
            font-size: 24px;
            font-weight: 700;
            font-style: italic;
        }
        
        .logo-text p {
            font-size: 12px;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .status-badge {
            padding: 10px 24px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: ${overallColor};
        }
        
        .test-name {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .test-subtitle {
            opacity: 0.7;
            font-size: 14px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px 40px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .info-icon {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .info-content label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6c757d;
            display: block;
            margin-bottom: 2px;
        }
        
        .info-content span {
            font-weight: 600;
            color: #212529;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .stat-item {
            padding: 24px 20px;
            text-align: center;
            border-right: 1px solid #e9ecef;
        }
        
        .stat-item:last-child {
            border-right: none;
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6c757d;
        }
        
        .stat-total .stat-number { color: #212529; }
        .stat-pass .stat-number { color: #4caf50; }
        .stat-fail .stat-number { color: #f44336; }
        .stat-warning .stat-number { color: #ff9800; }
        .stat-info .stat-number { color: #2196f3; }
        .stat-skip .stat-number { color: #9c27b0; }
        
        .progress-bar {
            padding: 20px 40px;
            background: #f8f9fa;
        }
        
        .progress-container {
            height: 12px;
            background: #e9ecef;
            border-radius: 6px;
            overflow: hidden;
            display: flex;
        }
        
        .progress-pass {
            background: #4caf50;
            height: 100%;
            transition: width 0.5s ease;
        }
        
        .progress-fail {
            background: #f44336;
            height: 100%;
            transition: width 0.5s ease;
        }
        
        .progress-legend {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 12px;
            font-size: 13px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        
        .steps-section {
            padding: 30px 40px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .steps-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        
        .steps-table th {
            background: #1a1a2e;
            color: white;
            padding: 16px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .steps-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: middle;
        }
        
        .steps-table tr:last-child td {
            border-bottom: none;
        }
        
        .steps-table tr:hover {
            background: #f8f9fa;
        }
        
        .step-number {
            width: 50px;
            font-weight: 600;
            color: #6c757d;
        }
        
        .step-description {
            font-weight: 500;
        }
        
        .step-status {
            width: 120px;
        }
        
        .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .step-details {
            color: #6c757d;
            font-size: 13px;
            max-width: 300px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #6c757d;
            font-size: 13px;
            border-top: 1px solid #e9ecef;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .report-card {
                box-shadow: none;
            }
        }
        
        @media (max-width: 768px) {
            .header-top {
                flex-direction: column;
                gap: 16px;
            }
            .stats-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            .stat-item {
                border-bottom: 1px solid #e9ecef;
            }
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="report-card">
            <div class="header">
                <div class="header-top">
                    <div class="logo">
                        <div class="logo-icon">
                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <!-- White Circle Background -->
                                <circle cx="25" cy="25" r="25" fill="white" stroke="#d0d0d0" stroke-width="0.5"/>
                                <!-- GILLETTE Text in Dark Blue -->
                                <text x="25" y="29" font-family="Futura LT Bold" font-size="9" font-weight="bold" font-style="italic" text-anchor="middle" fill="#1a3a52">GILLETTE</text>
                            </svg>
                        </div>
                        <div class="logo-text">
                            <h1>GILLETTE</h1>
                            <p>Modern Web Markets</p>
                        </div>
                    </div>
                    <div class="status-badge">${overallStatus}</div>
                </div>
                <div class="test-name">${this.testName}</div>
                <div class="test-subtitle">Automation Test Report</div>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-icon">📅</div>
                    <div class="info-content">
                        <label>Date</label>
                        <span>${this.formatDate(this.endTime)}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">⏰</div>
                    <div class="info-content">
                        <label>Time</label>
                        <span>${this.formatTime(this.endTime)}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">⏱️</div>
                    <div class="info-content">
                        <label>Duration</label>
                        <span>${duration}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">🌐</div>
                    <div class="info-content">
                        <label>Environment</label>
                        <span>${this.environment}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">🖥️</div>
                    <div class="info-content">
                        <label>Browser</label>
                        <span>${this.browser}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">👤</div>
                    <div class="info-content">
                        <label>Tested By</label>
                        <span>${this.testerName}</span>
                    </div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-item stat-total">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Steps</div>
                </div>
                <div class="stat-item stat-pass">
                    <div class="stat-number">${stats.pass}</div>
                    <div class="stat-label">Passed</div>
                </div>
                <div class="stat-item stat-fail">
                    <div class="stat-number">${stats.fail}</div>
                    <div class="stat-label">Failed</div>
                </div>
                <div class="stat-item stat-warning">
                    <div class="stat-number">${stats.warning}</div>
                    <div class="stat-label">Warnings</div>
                </div>
                <div class="stat-item stat-info">
                    <div class="stat-number">${stats.info}</div>
                    <div class="stat-label">Info</div>
                </div>
                <div class="stat-item stat-skip">
                    <div class="stat-number">${stats.skip}</div>
                    <div class="stat-label">Skipped</div>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-container">
                    <div class="progress-pass" style="width: ${stats.passRate}%"></div>
                    <div class="progress-fail" style="width: ${100 - parseFloat(stats.passRate)}%"></div>
                </div>
                <div class="progress-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background: #4caf50"></div>
                        <span>Pass Rate: ${stats.passRate}%</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background: #f44336"></div>
                        <span>Fail Rate: ${(100 - parseFloat(stats.passRate)).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
            
            <div class="steps-section">
                <div class="section-title">
                    <span>📋</span> Test Steps
                </div>
                <table class="steps-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Test Step</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.steps.map((step, index) => {
                          const style = this.getStatusStyle(step.status);
                          return `
                        <tr style="background: ${style.color}20">
                            <td class="step-number">${index + 1}</td>
                            <td class="step-description">${step.description}</td>
                            <td class="step-status">
                                <span class="status-pill" style="background: ${style.color}; color: ${style.textColor}">
                                    ${style.icon} ${step.status}
                                </span>
                            </td>
                            <td class="step-details">${step.details || '-'}</td>
                        </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                <p>Generated by <strong>Playwright Test Framework</strong> | ${this.formatDate(this.endTime)} ${this.formatTime(this.endTime)}</p>
                <p style="margin-top: 8px;">© ${new Date().getFullYear()} Gillette Modern Web Markets - Automation Testing</p>
            </div>
        </div>
    </div>
</body>
</html>`;

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the report
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`📊 HTML Report generated: ${filePath}`);
    
    return filePath;
  }

  /**
   * Generate report filename with timestamp
   * @param {string} prefix - Filename prefix
   * @param {string} outputDir - Output directory
   */
  getReportFilePath(prefix = 'TestReport', outputDir = './test-results/html-reports') {
    const timestamp = this.formatDate(new Date()).replace(/-/g, '') + '_' + this.formatTime(new Date()).replace(/:/g, '');
    const filename = `${prefix}_${timestamp}.html`;
    return path.join(outputDir, filename);
  }
}

/**
 * Create a new HTML report instance
 * @param {object} options - Report options
 * @returns {HtmlTestReport}
 */
export function createReport(options = {}) {
  return new HtmlTestReport(options);
}

export default HtmlTestReport;
