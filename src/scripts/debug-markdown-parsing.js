/**
 * Debug MORE-PROVIDERS.md parsing to understand the structure
 */
const fs = require('fs');

const MORE_PROVIDERS_FILE = '/home/ubuntu/main-server/MORE-PROVIDERS.md';

function debugMarkdownStructure() {
  const content = fs.readFileSync(MORE_PROVIDERS_FILE, 'utf8');
  const lines = content.split('\n');
  
  console.log(`📄 Total lines: ${lines.length}`);
  console.log('\n🔍 Looking for provider headers...\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Test the regex pattern - simplified to match any emoji
    const providerMatch = line.match(/###\s*[\u{1F300}-\u{1F9FF}]\s*\*\*(.*?)\*\*\s*-/u);
    
    if (line.startsWith('###') && line.includes('**')) {
      console.log(`Line ${i + 1}: ${line}`);
      if (providerMatch) {
        console.log(`  ✅ MATCHED: ${providerMatch[1]}`);
      } else {
        console.log(`  ❌ NO MATCH`);
      }
      console.log('');
    }
    
    // Check for JSON blocks
    if (line.startsWith('```javascript')) {
      console.log(`Line ${i + 1}: Found JavaScript block`);
      if (i > 0) {
        console.log(`  Previous line: ${lines[i-1].trim()}`);
      }
    }
  }
}

debugMarkdownStructure();