import puppeteer, { CookieParam, Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Initialize environment variables
import 'dotenv/config';

// LeetCode authentication tokens
const LEETCODE_CSRFTOKEN = process.env.LEETCODE_CSRFTOKEN;
const LEETCODE_SESSION = process.env.LEETCODE_SESSION;
const LEETCODE_CF_CLEARANCE = process.env.LEETCODE_CF_CLEARANCE;

// Additional cookie values from environment variables
const GR_CS1 = process.env.E_87b5a3c3f1a55520_gr_cs1;
const GR_LAST_SENT_CS1 = process.env.E_87b5a3c3f1a55520_gr_last_sent_cs1;
const INGRESSCOOKIE = process.env.INGRESSCOOKIE;
const STRIPE_MID = process.env.__stripe_mid;
const GA = process.env._ga;
const GR_USER_ID = process.env.gr_user_id;
const IP_CHECK = process.env.ip_check;

// Print environment variables for debuggings
console.log('Environment Variables:');
console.log('LEETCODE_CSRFTOKEN:', LEETCODE_CSRFTOKEN ? '✓ Set' : '✗ Not set');
console.log('LEETCODE_SESSION:', LEETCODE_SESSION ? '✓ Set' : '✗ Not set');
console.log('LEETCODE_CF_CLEARANCE:', LEETCODE_CF_CLEARANCE ? '✓ Set' : '✗ Not set');
console.log('E_87b5a3c3f1a55520_gr_cs1:', GR_CS1 ? '✓ Set' : '✗ Not set');
console.log('E_87b5a3c3f1a55520_gr_last_sent_cs1:', GR_LAST_SENT_CS1 ? '✓ Set' : '✗ Not set');
console.log('INGRESSCOOKIE:', INGRESSCOOKIE ? '✓ Set' : '✗ Not set');
console.log('__stripe_mid:', STRIPE_MID ? '✓ Set' : '✗ Not set');
console.log('_ga:', GA ? '✓ Set' : '✗ Not set');
console.log('gr_user_id:', GR_USER_ID ? '✓ Set' : '✗ Not set');
console.log('ip_check:', IP_CHECK ? '✓ Set' : '✗ Not set');

// Determine if we're running in a serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION;

// Global browser instance to be reused across requests
let browserInstance: Browser | null = null;

// Function to get the browser instance
async function getBrowserInstance(): Promise<Browser> {
  if (browserInstance) {
    try {
      // Check if the browser is still usable
      await browserInstance.version();
      return browserInstance;
    } catch {
      console.log('Browser instance is no longer usable, creating a new one');
      browserInstance = null;
    }
  }

  // Common browser arguments optimized for web scraping in serverless environments
  const browserArgs = [
    '--disable-blink-features=AutomationControlled',  // Hide automation
    '--no-sandbox',
    '--disable-web-security',                         // Allow cross-origin requests
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-dev-shm-usage',                        // Helps with memory issues
    '--disable-gpu',                                  // Disable GPU acceleration
    '--disable-setuid-sandbox',
    '--disable-accelerated-2d-canvas',
    '--no-zygote',                                    // Important for serverless
    '--ignore-certificate-errors',
    '--disable-extensions'
  ];

  try {
    if (isServerless) {
      // Serverless environment configuration with enhanced error handling
      console.log('Launching browser in serverless mode...');
      browserInstance = await puppeteer.launch({
        args: [...chromium.args, ...browserArgs],
        defaultViewport: {
          width: 1280,
          height: 800,
          deviceScaleFactor: 1,  // Reduced for better performance
        },
        executablePath: await chromium.executablePath(),
        headless: true,
        timeout: 30000           // Increase timeout for browser launch
      });
    } else {
      // Local development environment - use system Chrome
      console.log('Launching browser in local development mode...');
      browserInstance = await puppeteer.launch({
        headless: true,
        executablePath: process.platform === 'darwin' 
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // macOS path
          : process.platform === 'win32'
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Windows path
            : '/usr/bin/google-chrome', // Linux path
        args: browserArgs,
        defaultViewport: {
          width: 1280,
          height: 800,
          deviceScaleFactor: 2,  // Retina display simulation
        },
      });
    }
    console.log('Browser launched successfully');
    return browserInstance;
  } catch (error) {
    console.error(`Failed to launch browser: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    throw error; // Re-throw to handle it in the calling function
  }
}

export async function getPage() {
  try {
    // Get or create browser instance using the shared browser instance
    const browser = await getBrowserInstance();
    console.log('Browser instance acquired successfully');

    // Create a new context and set cookies at the context level
    const context = await browser.createBrowserContext();
    const page = await context.newPage();

    // Set cookies for authentication using environment variables
    if (LEETCODE_CSRFTOKEN && LEETCODE_SESSION && LEETCODE_CF_CLEARANCE) {
      // Define essential authentication cookies
      const cookies: CookieParam[] = [
        // Essential authentication cookies
        {
          name: "csrftoken",
          value: LEETCODE_CSRFTOKEN,
          domain: ".leetcode.com",
          path: "/",
          secure: true,
          sameSite: "Lax" as const
        },
        {
          name: "LEETCODE_SESSION",
          value: LEETCODE_SESSION,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        },
        {
          name: "cf_clearance",
          value: LEETCODE_CF_CLEARANCE,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        }
      ];
      
      // Add additional cookies from environment variables if they exist
      if (GR_CS1) {
        cookies.push({
          name: "87b5a3c3f1a55520_gr_cs1",
          value: GR_CS1,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
      
      if (GR_LAST_SENT_CS1) {
        cookies.push({
          name: "87b5a3c3f1a55520_gr_last_sent_cs1",
          value: GR_LAST_SENT_CS1,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
      
      if (INGRESSCOOKIE) {
        cookies.push({
          name: "INGRESSCOOKIE",
          value: INGRESSCOOKIE,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
      
      if (STRIPE_MID) {
        cookies.push({
          name: "__stripe_mid",
          value: STRIPE_MID,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
      
      if (GA) {
        cookies.push({
          name: "_ga",
          value: GA,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
      
      if (GR_USER_ID) {
        cookies.push({
          name: "gr_user_id",
          value: GR_USER_ID,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
      
      if (IP_CHECK) {
        cookies.push({
          name: "ip_check",
          value: IP_CHECK,
          domain: ".leetcode.com",
          path: "/",
          secure: true
        });
      }
    
      // Set all cookies one by one
      for (const cookie of cookies) {
        // Ensure all required properties are set
        const cookieToSet = {
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain || '.leetcode.com',
          path: cookie.path || '/',
          secure: cookie.secure || false,
          sameSite: cookie.sameSite || undefined
        };
        await context.setCookie(cookieToSet);
      }
    }

    // Set headers to mimic a real browser exactly as seen in the request
    await page.setExtraHTTPHeaders({
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    });
  
    // Set user agent separately (more reliable than in headers)
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36');

    return { browser, page };
  } catch (error) {
    console.error(`Error in getPage: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}

export async function fetchLeetCodePage(url: string) {
  console.log(`Fetching LeetCode page: ${url}`);
  let page = null;
  
  try {
    console.log('Initializing browser...');
    const browserSetup = await getPage();
    // We need the browser reference for logging but don't use it directly
    // const browser = browserSetup.browser;
    page = browserSetup.page;
    
    console.log('Browser initialized successfully');
    
    // Simplified request handling for serverless environment
    // Only intercept if not in serverless to reduce memory usage
    if (!isServerless) {
      await page.setRequestInterception(true);
      
      page.on('request', request => {
        console.log(`>> Request: ${request.method()} ${request.url()}`);
        request.continue();
      });
      
      page.on('response', response => {
        console.log(`<< Response: ${response.status()} ${response.url()}`);
      });
    }
    
    // Set referrer to mimic same-origin navigation
    await page.setExtraHTTPHeaders({
      'referer': 'https://leetcode.com/'
    });
    
    // Navigate to the URL with a longer timeout but simpler wait condition for serverless
    console.log(`Navigating to ${url}`);
    const response = await page.goto(url, { 
      waitUntil: isServerless ? 'domcontentloaded' : 'networkidle0',
      timeout: 30000 // Reduced timeout for serverless environments
    });
    
    if (!response) {
      throw new Error('No response received');
    }
    
    const statusCode = response.status();
    console.log(`Response status code: ${statusCode}`);
    
    if (statusCode >= 400) {
      throw new Error(`HTTP error: ${statusCode}`);
    }
    
    // Get the page content with a timeout
    console.log('Getting page content...');
    const htmlContent = await page.content();
    
    // Print content length for debugging
    console.log(`Content length: ${htmlContent.length}`);
    
    // In serverless, we don't close the browser, just the page
    // This allows browser reuse across requests
    console.log('Closing page...');
    await page.close();
    page = null;
    
    return { htmlContent, statusCode };
  } catch (error) {
    console.error(`Puppeteer error: ${error instanceof Error ? error.message : String(error)}`);
    console.error(error instanceof Error && error.stack ? error.stack : 'No stack trace available');
    
    // Make sure page is closed even if there's an error
    if (page) {
      try {
        console.log('Closing page after error...');
        await page.close();
      } catch (closeError) {
        console.error(`Error closing page: ${closeError instanceof Error ? closeError.message : String(closeError)}`);
      }
    }
    
    return { htmlContent: null, statusCode: 500 };
  }
}
