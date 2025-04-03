/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

// Function to load environment variables from parent directory
function loadEnvFromParent() {
  try {
    const parentEnvPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(parentEnvPath)) {
      console.log('Loading environment variables from parent directory...');
      const envContent = fs.readFileSync(parentEnvPath, 'utf8');
      
      // Parse the .env file content
      const envVars = envContent.split('\n').reduce((acc, line) => {
        // Skip empty lines and comments
        if (!line || line.startsWith('#')) return acc;
        
        // Split by first equals sign
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex).trim();
          const value = line.substring(equalIndex + 1).trim();
          if (key && value) {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
      
      // Add environment variables to process.env
      Object.entries(envVars).forEach(([key, value]) => {
        if (!process.env[key]) {
          process.env[key] = value;
          console.log(`Set environment variable: ${key}`);
        }
      });
      
      console.log('Parent environment variables loaded successfully');
    } else {
      console.log('No .env.local file found in parent directory');
    }
  } catch (error) {
    console.error('Error loading parent environment variables:', error);
  }
}

// Load environment variables from parent directory
loadEnvFromParent();

const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make sure environment variables are available to the client
    // Add any variables you want to expose to the client here
  },
  // Enable experimental features if needed
  experimental: {
    // serverActions: true,
  },
  // Configure webpack if needed
  webpack: (config, { isServer }) => {
    // Add any webpack configurations here
    return config;
  },
};

module.exports = nextConfig;
