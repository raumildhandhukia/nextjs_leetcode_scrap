'use client'

import { useState } from 'react'
import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a LeetCode URL');
      return;
    }
    
    if (!url.includes('leetcode.com')) {
      setError('Only LeetCode URLs are supported');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape the page');
      }
      
      // If companyTags is a string, parse it to JSON
      if (data.companyTags && typeof data.companyTags === 'string') {
        try {
          data.companyTags = JSON.parse(data.companyTags);
        } catch (parseError) {
          console.error('Failed to parse company tags:', parseError);
        }
      }
      
      setResult(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Image
            className="dark:invert mr-4"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={30}
            priority
          />
          <h1 className="text-3xl font-bold">LeetCode Scraper</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-2">
                LeetCode URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scraping...' : 'Scrape Page'}
            </button>
          </form>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-8">
            <p>{error}</p>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Scraping Results</h2>
            
            <div className="mb-4">
              <p><span className="font-medium">URL:</span> {result.url}</p>
              <p><span className="font-medium">Status Code:</span> {result.statusCode}</p>
              <p><span className="font-medium">Content Length:</span> {result.contentLength} characters</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Company Tags</h3>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                {result.companyTags ? (
                  <div className="space-y-4">
                    {/* Three Months Section */}
                    {result.companyTags.three_months && result.companyTags.three_months.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Last 3 Months</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.companyTags.three_months.map((company: any, index: number) => (
                            <div key={index} className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-sm">
                              <span className="font-medium">{company.name}</span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">({company.timesEncountered})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Six Months Section */}
                    {result.companyTags.six_months && result.companyTags.six_months.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Last 6 Months</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.companyTags.six_months.map((company: any, index: number) => (
                            <div key={index} className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full text-sm">
                              <span className="font-medium">{company.name}</span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">({company.timesEncountered})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* More Than Six Months Section */}
                    {result.companyTags.more_than_six_months && result.companyTags.more_than_six_months.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">More Than 6 Months</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.companyTags.more_than_six_months.map((company: any, index: number) => (
                            <div key={index} className="bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full text-sm">
                              <span className="font-medium">{company.name}</span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">({company.timesEncountered})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show raw JSON for debugging */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <details>
                        <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          View Raw Data
                        </summary>
                        <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto max-h-60 bg-gray-200 dark:bg-gray-700 p-2 rounded">
                          {JSON.stringify(result.companyTags, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                ) : (
                  <p>No company tag data available for this problem</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-12 flex gap-[24px] flex-wrap items-center justify-center text-sm">
        <p>Built with Next.js and Puppeteer for serverless web scraping</p>
      </footer>
    </div>
  );
}
