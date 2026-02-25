/**
 * HTML Report Generator
 * Generates beautiful HTML test reports from Playwright test results
 * 
 * Features:
 * - Comprehensive test statistics and metrics
 * - Interactive filtering and search
 * - Screenshots and artifacts links
 * - Pass/Fail visualization with charts
 * - Responsive design
 * - German localization support
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * HTML Report Generator Class
 */
export class HTMLReportGenerator {
  constructor(options = {}) {
    this.options = {
      reportTitle: options.reportTitle || 'Gillette Germany Test Report',
      projectName: options.projectName || 'Gillette Germany E-commerce',
      testSuite: options.testSuite || 'Regression Tests',
      outputPath: options.outputPath || './test-results/html-reports',
      includeScreenshots: options.includeScreenshots !== false,
      includeTimestamps: options.includeTimestamps !== false,
      ...options
    };
  }

  /**
   * Generate HTML report from test results
   * @param {Object} testResults - Test results object
   * @param {string} filename - Output filename (optional)
   * @returns {string} Path to generated report
   */
  generateReport(testResults, filename = null) {
    const timestamp = this._getTimestamp();
    const reportFilename = filename || `test-report-${timestamp}.html`;
    const reportPath = path.join(this.options.outputPath, reportFilename);

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputPath)) {
      fs.mkdirSync(this.options.outputPath, { recursive: true });
    }

    // Generate HTML content
    const htmlContent = this._generateHTML(testResults, timestamp);

    // Write to file
    fs.writeFileSync(reportPath, htmlContent, 'utf8');

    return reportPath;
  }

  /**
   * Generate HTML content
   * @private
   */
  _generateHTML(results, timestamp) {
    const stats = this._calculateStatistics(results);
    const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.options.reportTitle} - ${timestamp}</title>
    ${this._getStyles()}
</head>
<body>
    ${this._generateHeader(stats, timestamp)}
    ${this._generateSummary(stats)}
    ${this._generateFilterControls()}
    ${this._generateTestResults(results.tests || [])}
    ${this._generateFooter()}
    ${this._getScripts()}
</body>
</html>`;
    return html;
  }

  /**
   * Generate header section
   * @private
   */
  _generateHeader(stats, timestamp) {
    const statusIcon = stats.failedTests === 0 ? '✅' : '❌';
    const statusText = stats.failedTests === 0 ? 'PASSED' : 'FAILED';
    const statusClass = stats.failedTests === 0 ? 'status-success' : 'status-failure';

    return `
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-left">
                    <h1 class="header-title">
                        <span class="gillette-logo">🪒</span>
                        ${this.options.reportTitle}
                    </h1>
                    <p class="header-subtitle">${this.options.projectName}</p>
                </div>
                <div class="header-right">
                    <div class="status-badge ${statusClass}">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="status-text">${statusText}</span>
                    </div>
                    <p class="header-date">📅 ${timestamp}</p>
                </div>
            </div>
        </div>
    </header>`;
  }

  /**
   * Generate summary section with statistics
   * @private
   */
  _generateSummary(stats) {
    const passRate = stats.totalTests > 0 
      ? ((stats.passedTests / stats.totalTests) * 100).toFixed(1) 
      : 0;

    return `
    <section class="summary">
        <div class="container">
            <h2 class="section-title">📊 Test Execution Summary</h2>
            <div class="stats-grid">
                <div class="stat-card stat-total">
                    <div class="stat-icon">📝</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.totalTests}</div>
                        <div class="stat-label">Total Tests</div>
                    </div>
                </div>
                <div class="stat-card stat-passed">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.passedTests}</div>
                        <div class="stat-label">Passed</div>
                    </div>
                </div>
                <div class="stat-card stat-failed">
                    <div class="stat-icon">❌</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.failedTests}</div>
                        <div class="stat-label">Failed</div>
                    </div>
                </div>
                <div class="stat-card stat-skipped">
                    <div class="stat-icon">⚠️</div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.skippedTests}</div>
                        <div class="stat-label">Skipped</div>
                    </div>
                </div>
                <div class="stat-card stat-rate">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <div class="stat-value">${passRate}%</div>
                        <div class="stat-label">Pass Rate</div>
                    </div>
                </div>
                <div class="stat-card stat-duration">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                        <div class="stat-value">${this._formatDuration(stats.totalDuration)}</div>
                        <div class="stat-label">Duration</div>
                    </div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${passRate}%"></div>
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate filter controls
   * @private
   */
  _generateFilterControls() {
    return `
    <section class="filters">
        <div class="container">
            <div class="filter-controls">
                <input type="text" id="searchInput" class="search-input" placeholder="🔍 Search tests by name or ID...">
                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">All Tests</button>
                    <button class="filter-btn" data-filter="passed">✅ Passed</button>
                    <button class="filter-btn" data-filter="failed">❌ Failed</button>
                    <button class="filter-btn" data-filter="skipped">⚠️ Skipped</button>
                </div>
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate test results section
   * @private
   */
  _generateTestResults(tests) {
    if (!tests || tests.length === 0) {
      return `
      <section class="test-results">
          <div class="container">
              <h2 class="section-title">Test Results</h2>
              <p class="no-results">No test results available</p>
          </div>
      </section>`;
    }

    const testGroups = this._groupTestsByStatus(tests);
    let resultsHTML = `
    <section class="test-results">
        <div class="container">
            <h2 class="section-title">Test Results (${tests.length})</h2>
            <div class="test-list">`;

    tests.forEach((test, index) => {
      resultsHTML += this._generateTestCard(test, index);
    });

    resultsHTML += `
            </div>
        </div>
    </section>`;

    return resultsHTML;
  }

  /**
   * Generate individual test card
   * @private
   */
  _generateTestCard(test, index) {
    const status = test.status || 'unknown';
    const statusClass = `test-${status.toLowerCase()}`;
    const statusIcon = this._getStatusIcon(status);
    const duration = this._formatDuration(test.duration || 0);
    
    const testId = test.testId || test.id || `test-${index + 1}`;
    const testTitle = test.title || test.name || 'Untitled Test';
    const fullTitle = test.fullTitle || testTitle;

    return `
    <div class="test-card ${statusClass}" data-status="${status.toLowerCase()}" data-test-id="${testId}">
        <div class="test-header">
            <div class="test-title-wrapper">
                <span class="test-status-icon">${statusIcon}</span>
                <div class="test-title-content">
                    <h3 class="test-title">${testTitle}</h3>
                    ${test.testId ? `<span class="test-id">${test.testId}</span>` : ''}
                </div>
            </div>
            <div class="test-meta">
                <span class="test-duration">⏱️ ${duration}</span>
                <button class="test-expand-btn" onclick="toggleTestDetails(${index})">
                    <span class="expand-icon">▼</span>
                </button>
            </div>
        </div>
        <div class="test-details" id="test-details-${index}" style="display: none;">
            ${this._generateTestDetails(test)}
        </div>
    </div>`;
  }

  /**
   * Generate test details section
   * @private
   */
  _generateTestDetails(test) {
    let detailsHTML = '<div class="test-details-content">';

    // Test steps
    if (test.steps && test.steps.length > 0) {
      detailsHTML += '<div class="test-section"><h4>📋 Test Steps</h4><ol class="test-steps">';
      test.steps.forEach(step => {
        const stepStatus = step.status || 'passed';
        const stepIcon = this._getStatusIcon(stepStatus);
        detailsHTML += `<li class="test-step test-step-${stepStatus}">
          <span class="step-icon">${stepIcon}</span>
          <span class="step-text">${step.description || step.title || step}</span>
        </li>`;
      });
      detailsHTML += '</ol></div>';
    }

    // Expected results
    if (test.expectedResults && test.expectedResults.length > 0) {
      detailsHTML += '<div class="test-section"><h4>✅ Expected Results</h4><ul class="expected-results">';
      test.expectedResults.forEach(result => {
        detailsHTML += `<li>${result}</li>`;
      });
      detailsHTML += '</ul></div>';
    }

    // Validations
    if (test.validations && test.validations.length > 0) {
      detailsHTML += '<div class="test-section"><h4>🔍 Validations</h4><ul class="validations">';
      test.validations.forEach(validation => {
        const validationIcon = validation.passed !== false ? '✅' : '❌';
        detailsHTML += `<li><span class="validation-icon">${validationIcon}</span> ${validation.description || validation}</li>`;
      });
      detailsHTML += '</ul></div>';
    }

    // Error information
    if (test.error || test.errorMessage) {
      const errorMessage = test.error?.message || test.errorMessage || 'Unknown error';
      const errorStack = test.error?.stack || test.errorStack || '';
      detailsHTML += `<div class="test-section test-error">
        <h4>❌ Error Details</h4>
        <div class="error-message">${this._escapeHtml(errorMessage)}</div>
        ${errorStack ? `<details class="error-stack"><summary>Stack Trace</summary><pre>${this._escapeHtml(errorStack)}</pre></details>` : ''}
      </div>`;
    }

    // Screenshots and artifacts
    if (test.screenshots || test.artifacts) {
      detailsHTML += '<div class="test-section"><h4>📸 Screenshots & Artifacts</h4><div class="artifacts">';
      
      if (test.screenshots && test.screenshots.length > 0) {
        test.screenshots.forEach(screenshot => {
          const screenshotPath = screenshot.path || screenshot;
          const screenshotName = path.basename(screenshotPath);
          detailsHTML += `<a href="${screenshotPath}" target="_blank" class="artifact-link">
            🖼️ ${screenshotName}
          </a>`;
        });
      }
      
      if (test.artifacts && test.artifacts.length > 0) {
        test.artifacts.forEach(artifact => {
          const artifactPath = artifact.path || artifact;
          const artifactName = path.basename(artifactPath);
          detailsHTML += `<a href="${artifactPath}" target="_blank" class="artifact-link">
            📎 ${artifactName}
          </a>`;
        });
      }
      
      detailsHTML += '</div></div>';
    }

    // Test metadata
    if (test.browser || test.viewport || test.url) {
      detailsHTML += '<div class="test-section"><h4>ℹ️ Test Metadata</h4><ul class="test-metadata">';
      if (test.browser) detailsHTML += `<li><strong>Browser:</strong> ${test.browser}</li>`;
      if (test.viewport) detailsHTML += `<li><strong>Viewport:</strong> ${test.viewport}</li>`;
      if (test.url) detailsHTML += `<li><strong>URL:</strong> <a href="${test.url}" target="_blank">${test.url}</a></li>`;
      if (test.retries) detailsHTML += `<li><strong>Retries:</strong> ${test.retries}</li>`;
      detailsHTML += '</ul></div>';
    }

    detailsHTML += '</div>';
    return detailsHTML;
  }

  /**
   * Generate footer
   * @private
   */
  _generateFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <p>Generated by Gillette Germany Test Automation Framework</p>
            <p>Powered by Playwright | © ${new Date().getFullYear()}</p>
        </div>
    </footer>`;
  }

  /**
   * Get CSS styles
   * @private
   */
  _getStyles() {
    return `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 30px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .header-left {
            flex: 1;
        }

        .header-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1a202c;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .gillette-logo {
            font-size: 2.5rem;
        }

        .header-subtitle {
            color: #718096;
            font-size: 1rem;
            margin-top: 5px;
        }

        .header-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }

        .status-badge {
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1rem;
        }

        .status-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .status-failure {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }

        .header-date {
            color: #718096;
            font-size: 0.9rem;
        }

        /* Summary Section */
        .summary {
            background: white;
            padding: 40px 0;
            margin: 30px 0;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .section-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 30px;
            color: #1a202c;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 25px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid transparent;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-total { border-color: #3b82f6; }
        .stat-passed { border-color: #10b981; }
        .stat-failed { border-color: #ef4444; }
        .stat-skipped { border-color: #f59e0b; }
        .stat-rate { border-color: #8b5cf6; }
        .stat-duration { border-color: #06b6d4; }

        .stat-icon {
            font-size: 2.5rem;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1a202c;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e5e7eb;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-weight: 600;
        }

        /* Filters */
        .filters {
            background: white;
            padding: 30px 0;
            margin: 30px 0;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .filter-controls {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            align-items: center;
        }

        .search-input {
            flex: 1;
            min-width: 300px;
            padding: 15px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .filter-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 12px 24px;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .filter-btn:hover {
            border-color: #667eea;
            transform: translateY(-2px);
        }

        .filter-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
        }

        /* Test Results */
        .test-results {
            background: white;
            padding: 40px 0;
            margin: 30px 0;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .test-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .test-card {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .test-card:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .test-passed {
            border-left: 5px solid #10b981;
        }

        .test-failed {
            border-left: 5px solid #ef4444;
        }

        .test-skipped {
            border-left: 5px solid #f59e0b;
        }

        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            cursor: pointer;
            background: #f9fafb;
        }

        .test-title-wrapper {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
        }

        .test-status-icon {
            font-size: 1.5rem;
        }

        .test-title-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .test-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1a202c;
        }

        .test-id {
            font-size: 0.85rem;
            color: #718096;
            font-family: 'Courier New', monospace;
            background: #e5e7eb;
            padding: 2px 8px;
            border-radius: 5px;
        }

        .test-meta {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .test-duration {
            color: #718096;
            font-size: 0.9rem;
        }

        .test-expand-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            color: #718096;
            transition: transform 0.3s ease;
            padding: 5px 10px;
        }

        .test-expand-btn:hover {
            color: #667eea;
        }

        .test-expand-btn.expanded .expand-icon {
            transform: rotate(180deg);
        }

        .test-details {
            border-top: 1px solid #e5e7eb;
            background: white;
        }

        .test-details-content {
            padding: 25px;
        }

        .test-section {
            margin-bottom: 25px;
        }

        .test-section h4 {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #1a202c;
        }

        .test-steps, .expected-results, .validations, .test-metadata {
            list-style: none;
            padding-left: 0;
        }

        .test-steps li, .expected-results li, .validations li, .test-metadata li {
            padding: 10px 15px;
            margin-bottom: 8px;
            background: #f9fafb;
            border-radius: 8px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .step-icon, .validation-icon {
            font-size: 1rem;
            flex-shrink: 0;
        }

        .test-step-failed {
            background: #fee2e2;
        }

        .test-error {
            background: #fee2e2;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #ef4444;
        }

        .error-message {
            color: #991b1b;
            font-weight: 600;
            margin-bottom: 10px;
            font-family: 'Courier New', monospace;
        }

        .error-stack {
            margin-top: 10px;
        }

        .error-stack summary {
            cursor: pointer;
            color: #dc2626;
            font-weight: 600;
            padding: 5px;
        }

        .error-stack pre {
            background: #1a202c;
            color: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.85rem;
            margin-top: 10px;
        }

        .artifacts {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .artifact-link {
            display: inline-block;
            padding: 10px 15px;
            background: #eff6ff;
            color: #1e40af;
            text-decoration: none;
            border-radius: 8px;
            border: 1px solid #bfdbfe;
            transition: all 0.3s ease;
        }

        .artifact-link:hover {
            background: #dbeafe;
            transform: translateY(-2px);
        }

        .no-results {
            text-align: center;
            padding: 40px;
            color: #718096;
            font-size: 1.1rem;
        }

        /* Footer */
        .footer {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px 0;
            text-align: center;
            color: #718096;
            margin-top: 40px;
        }

        .footer p {
            margin: 5px 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                align-items: flex-start;
            }

            .header-right {
                align-items: flex-start;
            }

            .header-title {
                font-size: 1.5rem;
            }

            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }

            .filter-controls {
                flex-direction: column;
                align-items: stretch;
            }

            .search-input {
                min-width: 100%;
            }

            .filter-buttons {
                justify-content: center;
            }

            .test-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
        }

        /* Print styles */
        @media print {
            body {
                background: white;
            }

            .header {
                position: static;
            }

            .test-expand-btn {
                display: none;
            }

            .test-details {
                display: block !important;
            }

            .filter-controls {
                display: none;
            }
        }
    </style>`;
  }

  /**
   * Get JavaScript for interactive features
   * @private
   */
  _getScripts() {
    return `<script>
        // Toggle test details
        function toggleTestDetails(index) {
            const details = document.getElementById('test-details-' + index);
            const btn = details.previousElementSibling.querySelector('.test-expand-btn');
            
            if (details.style.display === 'none') {
                details.style.display = 'block';
                btn.classList.add('expanded');
            } else {
                details.style.display = 'none';
                btn.classList.remove('expanded');
            }
        }

        // Filter tests
        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const searchInput = document.getElementById('searchInput');
            const testCards = document.querySelectorAll('.test-card');

            let currentFilter = 'all';
            let currentSearch = '';

            function applyFilters() {
                testCards.forEach(card => {
                    const status = card.dataset.status;
                    const testId = card.dataset.testId || '';
                    const title = card.querySelector('.test-title')?.textContent.toLowerCase() || '';
                    
                    const matchesFilter = currentFilter === 'all' || status === currentFilter;
                    const matchesSearch = currentSearch === '' || 
                        title.includes(currentSearch) || 
                        testId.toLowerCase().includes(currentSearch);
                    
                    card.style.display = matchesFilter && matchesSearch ? 'block' : 'none';
                });
            }

            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    applyFilters();
                });
            });

            searchInput.addEventListener('input', function() {
                currentSearch = this.value.toLowerCase();
                applyFilters();
            });

            // Add smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        });
    </script>`;
  }

  /**
   * Calculate statistics from test results
   * @private
   */
  _calculateStatistics(results) {
    const tests = results.tests || [];
    const stats = {
      totalTests: tests.length,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      totalDuration: 0
    };

    tests.forEach(test => {
      if (test.status === 'passed') stats.passedTests++;
      else if (test.status === 'failed') stats.failedTests++;
      else if (test.status === 'skipped') stats.skippedTests++;
      
      stats.totalDuration += test.duration || 0;
    });

    return stats;
  }

  /**
   * Group tests by status
   * @private
   */
  _groupTestsByStatus(tests) {
    return {
      passed: tests.filter(t => t.status === 'passed'),
      failed: tests.filter(t => t.status === 'failed'),
      skipped: tests.filter(t => t.status === 'skipped')
    };
  }

  /**
   * Get status icon
   * @private
   */
  _getStatusIcon(status) {
    const icons = {
      passed: '✅',
      failed: '❌',
      skipped: '⚠️',
      pending: '⏸️',
      unknown: '❓'
    };
    return icons[status.toLowerCase()] || icons.unknown;
  }

  /**
   * Format duration
   * @private
   */
  _formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  /**
   * Get timestamp
   * @private
   */
  _getTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${pad(now.getDate())}-${months[now.getMonth()]}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  }

  /**
   * Escape HTML
   * @private
   */
  _escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

/**
 * Helper function to generate report from Playwright results
 * @param {Object} playwrightResults - Results from Playwright test runner
 * @param {Object} options - Generator options
 * @returns {string} Path to generated report
 */
export function generateHTMLReport(playwrightResults, options = {}) {
  const generator = new HTMLReportGenerator(options);
  return generator.generateReport(playwrightResults);
}

/**
 * Example usage function
 */
export function exampleUsage() {
  // Example test results structure
  const testResults = {
    tests: [
      {
        testId: 'TC-Homepage-01',
        title: 'Homepage loads properly with all sections visible',
        status: 'passed',
        duration: 8500,
        browser: 'Chromium',
        viewport: '1920x1080',
        url: 'https://www.gillette.de/de-de',
        steps: [
          { description: 'Navigate to homepage', status: 'passed' },
          { description: 'Accept cookie consent', status: 'passed' },
          { description: 'Verify all sections visible', status: 'passed' }
        ],
        validations: [
          { description: 'URL contains gillette.de/de-de', passed: true },
          { description: 'Section "Alles, was du brauchst" is visible', passed: true },
          { description: 'Section "Unsere Produkte" is visible', passed: true }
        ]
      },
      {
        testId: 'TC-Homepage-02',
        title: 'Verify logo container in Header with all brand logos',
        status: 'passed',
        duration: 29600,
        browser: 'Chromium',
        viewport: '1920x1080',
        url: 'https://www.gillette.de/de-de'
      }
    ]
  };

  const generator = new HTMLReportGenerator({
    reportTitle: 'Gillette Germany Test Report',
    projectName: 'Gillette Germany E-commerce',
    outputPath: './test-results/html-reports'
  });

  return generator.generateReport(testResults);
}
