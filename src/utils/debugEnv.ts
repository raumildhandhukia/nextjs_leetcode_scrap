/**
 * Debug utility to check environment variables
 */

export function debugEnvironmentVariables() {
  console.log('===== DEBUG: Environment Variables =====');
  
  // Check essential auth variables
  const essentialVars = [
    'LEETCODE_CSRFTOKEN',
    'LEETCODE_SESSION',
    'LEETCODE_CF_CLEARANCE'
  ];
  
  // Check additional cookie variables
  const additionalVars = [
    '87b5a3c3f1a55520_gr_cs1',
    '87b5a3c3f1a55520_gr_last_sent_cs1',
    'INGRESSCOOKIE',
    '__stripe_mid',
    '_ga',
    'gr_user_id',
    'ip_check'
  ];
  
  // Log essential variables
  console.log('\nEssential Auth Variables:');
  essentialVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}: ${value ? '✓ Set' : '✗ Not set'}`);
    if (value) {
      console.log(`  Length: ${value.length} chars`);
      console.log(`  Preview: ${value.substring(0, 10)}...`);
    }
  });
  
  // Log additional variables
  console.log('\nAdditional Cookie Variables:');
  additionalVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}: ${value ? '✓ Set' : '✗ Not set'}`);
    if (value) {
      console.log(`  Length: ${value.length} chars`);
      console.log(`  Preview: ${value.substring(0, 10)}...`);
    }
  });
  
  // Log all environment variables (masked for security)
  console.log('\nAll Environment Variables:');
  Object.keys(process.env).forEach(key => {
    const value = process.env[key];
    if (typeof value === 'string') {
      console.log(`${key}: ${value ? '✓ Set' : '✗ Not set'}`);
    }
  });
  
  console.log('=======================================');
}

export default debugEnvironmentVariables;
