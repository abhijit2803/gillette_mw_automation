/**
 * Execute Homepage Report Generation
 * Simple script to generate all homepage HTML reports
 */

import { generateHomepageReports } from './utils/homepageReportGenerator.js';

console.log('='.repeat(60));
console.log('   GILLETTE GERMANY - HOMEPAGE REPORT GENERATOR');
console.log('='.repeat(60));
console.log('');

try {
  const result = generateHomepageReports();
  console.log('='.repeat(60));
  if (result.success) {
    console.log('   ✨ SUCCESS - All reports generated!');
    console.log('='.repeat(60));
    process.exit(0);
  } else {
    console.log('   ⚠️  WARNING - Completed with errors');
    console.log('='.repeat(60));
    process.exit(1);
  }
} catch (error) {
  console.log('='.repeat(60));
  console.error('   💥 ERROR:', error.message);
  console.log('='.repeat(60));
  process.exit(1);
}
