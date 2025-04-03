import { NextRequest, NextResponse } from 'next/server';
import { fetchLeetCodePage } from '@/utils/puppeteer';
import { extractCompanyTags } from '@/utils/companyTagExtractor';
// import debugEnvironmentVariables from '@/utils/debugEnv';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // US East (N. Virginia)
};

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    // debugEnvironmentVariables();
    
    // Get the URL from the query parameters
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate the URL is from LeetCode
    if (!url.includes('leetcode.com')) {
      return NextResponse.json(
        { error: 'Only LeetCode URLs are supported' },
        { status: 400 }
      );
    }
    
    console.log(`Processing request to scrape: ${url}`);
    
    // Fetch the page content
    const { htmlContent, statusCode } = await fetchLeetCodePage(url);
    
    if (!htmlContent || statusCode >= 400) {
      return NextResponse.json(
        { error: `Failed to fetch page content. Status code: ${statusCode}` },
        { status: statusCode || 500 }
      );
    }
    
    // Extract company tag data
    
    const companyTags = extractCompanyTags(htmlContent);
    
    // Return the company tag data instead of HTML content
    return NextResponse.json(
      { 
        url,
        statusCode,
        companyTags,
        contentLength: htmlContent.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required in the request body' },
        { status: 400 }
      );
    }
    
    // Validate the URL is from LeetCode
    if (!url.includes('leetcode.com')) {
      return NextResponse.json(
        { error: 'Only LeetCode URLs are supported' },
        { status: 400 }
      );
    }
    
    console.log(`Processing POST request to scrape: ${url}`);
    
    // Fetch the page content
    const { htmlContent, statusCode } = await fetchLeetCodePage(url);
    
    if (!htmlContent || statusCode >= 400) {
      return NextResponse.json(
        { error: `Failed to fetch page content. Status code: ${statusCode}` },
        { status: statusCode || 500 }
      );
    }
    
    // Extract company tag data
    const companyTags = extractCompanyTags(htmlContent);
    
    // Return the company tag data instead of HTML content
    return NextResponse.json(
      { 
        url,
        statusCode,
        companyTags,
        contentLength: htmlContent.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
