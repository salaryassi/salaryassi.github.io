import { marked } from 'marked';

export async function convertMarkdownFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const markdownContent = await response.text();
    const htmlContent = marked(markdownContent);
    console.log(htmlContent); // Add this line to check the HTML content
    return htmlContent;
  } catch (error) {
    console.error('Error fetching or converting markdown:', error);
    return '<p>Error loading content.</p>';
  }
}
