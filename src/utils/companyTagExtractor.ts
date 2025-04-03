/**
 * Extracts company tag data from LeetCode HTML content
 * This implements the same functionality as the Python BeautifulSoup version
 * but using pure TypeScript/JavaScript
 */
export function extractCompanyTags(htmlContent: string): any {
  try {
    console.log("Starting company tag extraction...");
    
    // Find the __NEXT_DATA__ script tag which contains the companyTagStatsV2 data
    const nextDataRegex = /<script id="__NEXT_DATA__" type="application\/json">[\s\S]*?<\/script>/;
    const nextDataMatch = htmlContent.match(nextDataRegex);
    
    console.log(`Found __NEXT_DATA__ script: ${nextDataMatch !== null}`);
    
    // Extract the content between the script tags if found
    let nextDataContent = null;
    if (nextDataMatch && nextDataMatch[0]) {
      const openingTagLength = '<script id="__NEXT_DATA__" type="application/json">'.length;
      const closingTagLength = '</script>'.length;
      nextDataContent = nextDataMatch[0].slice(
        openingTagLength,
        nextDataMatch[0].length - closingTagLength
      );
    }
    
    if (!nextDataContent) {
      console.log("Could not find or extract __NEXT_DATA__ script tag content");
      return null;
    }
    
    try {
      // Parse the JSON data from the script tag
      const nextData = JSON.parse(nextDataContent);
      console.log("Successfully parsed __NEXT_DATA__ JSON");
      
      // Navigate through the exact path to find companyTagStatsV2
      let companyTagStats = null;
      
      try {
        // Follow the exact path as in the Python implementation
        if (nextData?.props?.pageProps?.dehydratedState?.queries?.length > 1) {
          // Access the second query (index 1)
          const query = nextData.props.pageProps.dehydratedState.queries[1];
          if (query?.state?.data?.question?.companyTagStatsV2) {
            companyTagStats = JSON.parse(JSON.stringify(query.state.data.question.companyTagStatsV2));
            console.log("Found companyTagStatsV2 at the exact specified path");
          }
        }
      } catch (error) {
        console.log(`Error following exact path: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      return companyTagStats;
    } catch (error) {
      console.log(`Error parsing __NEXT_DATA__ JSON: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  } catch (error) {
    console.error(`Error extracting company tags: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return null;
  }
}
