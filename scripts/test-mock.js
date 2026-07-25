/**
 * Structural integration tests for PixelMind Recruit AI.
 * Verifies key project files, dependencies, and configuration templates exist.
 */

const fs = require('fs');
const path = require('path');

console.log("🚀 Starting project structural integration tests...");

function assertFileExists(filePath) {
  const absolutePath = path.resolve(__dirname, '..', filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Assertion failed: File ${filePath} is missing!`);
    process.exit(1);
  }
  console.log(`✅ Verified file: ${filePath}`);
}

// 1. Verify directory entrypoints
console.log("\n🧪 Auditing codebase layout...");
assertFileExists('package.json');
assertFileExists('tsconfig.json');
assertFileExists('app/globals.css');
assertFileExists('app/layout.tsx');
assertFileExists('app/page.tsx');
assertFileExists('app/dashboard/page.tsx');
assertFileExists('types/index.ts');
assertFileExists('services/geminiService.ts');
assertFileExists('services/mockData.ts');
assertFileExists('services/resumeStorage.ts');

// 2. Verify component panels
console.log("\n🧪 Auditing dashboard module components...");
assertFileExists('components/dashboard/OverviewPanel.tsx');
assertFileExists('components/dashboard/AnalyzerPanel.tsx');
assertFileExists('components/dashboard/MatcherPanel.tsx');
assertFileExists('components/dashboard/CoverLetterPanel.tsx');
assertFileExists('components/dashboard/InterviewPanel.tsx');
assertFileExists('components/dashboard/CoachPanel.tsx');
assertFileExists('components/dashboard/RecruiterPanel.tsx');
assertFileExists('components/dashboard/SettingsPanel.tsx');
assertFileExists('components/dashboard/ProfilePanel.tsx');

// 3. Verify package.json script integrity
console.log("\n🧪 Auditing script definitions in package.json...");
const pkg = require('../package.json');
if (!pkg.dependencies || !pkg.dependencies.next) {
  console.error("❌ Assertion failed: 'next' dependency is missing in package.json!");
  process.exit(1);
}
console.log("✅ Verified: Next.js is configured in package.json dependencies.");

console.log("\n🎉 All smoke tests passed successfully! Project structure is healthy.");
process.exit(0);
