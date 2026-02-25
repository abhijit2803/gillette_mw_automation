/**
 * Table Generator Utility
 * Provides reusable HTML table generation functions for test reports
 */

/**
 * Generate HTML table for image alt tag validation results
 * @param {Array<{index: number, filename: string, alt: string, hasAlt: boolean}>} images - Array of image objects
 * @returns {string} HTML table string
 */
export function generateImageAltTagTable(images) {
  if (!images || images.length === 0) {
    return '<p>No images found</p>';
  }

  let tableHtml = '<table style="width:100%; border-collapse: collapse; margin-top: 10px;">' +
    '<tr style="background-color: #f0f0f0;">' +
    '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">#</th>' +
    '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Image Filename</th>' +
    '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Alt Tag</th>' +
    '<th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Status</th>' +
    '</tr>';
  
  images.forEach(img => {
    const statusIcon = img.hasAlt ? '✅' : '❌';
    const statusText = img.hasAlt ? 'PRESENT' : 'MISSING';
    const statusColor = img.hasAlt ? '#4CAF50' : '#f44336';
    const altText = img.alt || '(No alt tag)';
    
    tableHtml += '<tr>' +
      `<td style="border: 1px solid #ddd; padding: 8px;">${img.index}</td>` +
      `<td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${img.filename}</td>` +
      `<td style="border: 1px solid #ddd; padding: 8px;">${altText}</td>` +
      `<td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: ${statusColor}; font-weight: bold;">${statusIcon} ${statusText}</td>` +
      '</tr>';
  });
  
  tableHtml += '</table>';
  return tableHtml;
}

/**
 * Generate generic HTML table from data array
 * @param {Array<string>} headers - Table header labels
 * @param {Array<Array<{value: string, color?: string, bold?: boolean}>>} rows - Table rows data
 * @returns {string} HTML table string
 */
export function generateGenericTable(headers, rows) {
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return '<p>No data available</p>';
  }

  let tableHtml = '<table style="width:100%; border-collapse: collapse; margin-top: 10px;">' +
    '<tr style="background-color: #f0f0f0;">';
  
  headers.forEach(header => {
    tableHtml += `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${header}</th>`;
  });
  
  tableHtml += '</tr>';
  
  rows.forEach(row => {
    tableHtml += '<tr>';
    row.forEach(cell => {
      const cellValue = typeof cell === 'string' ? cell : cell.value;
      const cellColor = cell.color ? `color: ${cell.color};` : '';
      const cellWeight = cell.bold ? 'font-weight: bold;' : '';
      tableHtml += `<td style="border: 1px solid #ddd; padding: 8px; ${cellColor} ${cellWeight}">${cellValue}</td>`;
    });
    tableHtml += '</tr>';
  });
  
  tableHtml += '</table>';
  return tableHtml;
}
