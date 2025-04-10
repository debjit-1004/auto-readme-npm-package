import { extname } from 'path';

/**
 * Merges existing README content with newly generated content
 * while preserving specified manual sections
 */
export function mergeContents(existingContent, newContent, config) {
  if (!existingContent) return newContent;
  
  // Extract all section blocks from both contents
  const existingSections = extractSections(existingContent);
  const newSections = extractSections(newContent);
  
  // Start with new content
  let mergedContent = newContent;
  
  // For each manual section in the existing content, replace in the new content
  for (const [sectionName, sectionContent] of Object.entries(existingSections)) {
    // Check if this is a manual section (not in autoSections)
    if (!config.autoSections.includes(sectionName.toLowerCase())) {
      const startTag = `<!-- AUTO-${sectionName.toUpperCase()} -->`;
      const endTag = `<!-- /AUTO-${sectionName.toUpperCase()} -->`;
      
      // Replace content between tags with original content
      const regExp = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'm');
      mergedContent = mergedContent.replace(
        regExp, 
        `${startTag}\n${sectionContent}\n${endTag}`
      );
    }
  }
  
  return mergedContent;
}

/**
 * Extracts all sections from README content
 * @returns {Object} Map of section names to their content
 */
function extractSections(content) {
  const sectionRegex = /<!-- AUTO-([A-Z-]+) -->\n([\s\S]*?)\n<!-- \/AUTO-([A-Z-]+) -->/g;
  const sections = {};
  
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const sectionName = match[1];
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }
  
  return sections;
}