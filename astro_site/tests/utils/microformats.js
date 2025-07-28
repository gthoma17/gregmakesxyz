import { mf2 } from 'microformats-parser';

/**
 * Parse microformats from HTML content
 * @param {string} html - HTML content to parse
 * @returns {object} Parsed microformats data
 */
export function parseMicroformats(html) {
  return mf2(html, { baseUrl: 'https://gregmakes.xyz' });
}

/**
 * Validate that an h-card exists with required properties
 * @param {object} mfData - Parsed microformats data
 * @returns {object} Validation result
 */
export function validateHCard(mfData) {
  const hCards = mfData.items.filter(item => item.type.includes('h-card'));
  
  if (hCards.length === 0) {
    return { valid: false, message: 'No h-card found' };
  }

  const hCard = hCards[0];
  const properties = hCard.properties;
  
  const required = ['name', 'photo'];
  const missing = required.filter(prop => !properties[prop] || properties[prop].length === 0);
  
  if (missing.length > 0) {
    return { 
      valid: false, 
      message: `h-card missing required properties: ${missing.join(', ')}` 
    };
  }

  return { 
    valid: true, 
    message: 'h-card is valid',
    data: {
      name: properties.name[0],
      photo: properties.photo[0],
      nickname: properties.nickname?.[0],
      email: properties.email?.[0],
      url: properties.url?.[0]
    }
  };
}

/**
 * Validate that h-entry exists with required properties
 * @param {object} mfData - Parsed microformats data
 * @returns {object} Validation result
 */
export function validateHEntry(mfData) {
  // Look for h-entry in top-level items and also in children of h-feed items
  let hEntries = mfData.items.filter(item => item.type.includes('h-entry'));
  
  // Also check children of h-feed items
  const hFeeds = mfData.items.filter(item => item.type.includes('h-feed'));
  hFeeds.forEach(feed => {
    if (feed.children) {
      const childEntries = feed.children.filter(child => child.type.includes('h-entry'));
      hEntries = hEntries.concat(childEntries);
    }
  });
  
  if (hEntries.length === 0) {
    return { valid: false, message: 'No h-entry found' };
  }

  const results = hEntries.map((entry, index) => {
    const properties = entry.properties;
    
    // For h-entry, we need either content or name property (name is enough for homepage)
    const hasContent = properties.content && properties.content.length > 0;
    const hasName = properties.name && properties.name.length > 0;
    
    if (!hasContent && !hasName) {
      return { 
        valid: false, 
        message: `h-entry ${index + 1} missing content or name property` 
      };
    }

    // For blog posts and notes, we should have author information
    // For homepage h-entry, this is optional
    const hasAuthor = properties.author && properties.author.length > 0;
    const hasPublished = properties.published && properties.published.length > 0;
    
    // If it has published date, it should be a blog post/note and needs author
    if (hasPublished && !hasAuthor) {
      return { 
        valid: false, 
        message: `h-entry ${index + 1} has published date but missing author information` 
      };
    }

    return { 
      valid: true, 
      message: `h-entry ${index + 1} is valid`,
      data: {
        content: properties.content?.[0],
        author: properties.author?.[0],
        published: properties.published?.[0],
        name: properties.name?.[0]
      }
    };
  });

  const invalidEntries = results.filter(r => !r.valid);
  if (invalidEntries.length > 0) {
    return invalidEntries[0]; // Return first error
  }

  return { 
    valid: true, 
    message: `All ${hEntries.length} h-entry items are valid`,
    count: hEntries.length,
    entries: results.map(r => r.data)
  };
}

/**
 * Validate that h-feed exists with h-entry children
 * @param {object} mfData - Parsed microformats data
 * @returns {object} Validation result
 */
export function validateHFeed(mfData) {
  const hFeeds = mfData.items.filter(item => item.type.includes('h-feed'));
  
  if (hFeeds.length === 0) {
    return { valid: false, message: 'No h-feed found' };
  }

  const hFeed = hFeeds[0];
  
  // h-feed can have children OR be a container for h-entry items that are siblings
  const children = hFeed.children || [];
  const hEntryChildren = children.filter(child => child.type.includes('h-entry'));
  
  // Also check if there are h-entry items as siblings in the same document
  const allHEntries = mfData.items.filter(item => item.type.includes('h-entry'));
  
  if (hEntryChildren.length === 0 && allHEntries.length === 0) {
    return { 
      valid: false, 
      message: 'h-feed has no h-entry children or siblings' 
    };
  }

  const entryCount = hEntryChildren.length > 0 ? hEntryChildren.length : allHEntries.length;

  return { 
    valid: true, 
    message: `h-feed is valid with ${entryCount} h-entry items`,
    data: {
      entryCount: entryCount,
      feedProperties: hFeed.properties,
      hasChildren: hEntryChildren.length > 0,
      hasSiblings: allHEntries.length > 0
    }
  };
}

/**
 * Validate datetime properties are properly formatted
 * @param {object} mfData - Parsed microformats data
 * @returns {object} Validation result
 */
export function validateDatetimes(mfData) {
  const errors = [];
  
  function checkDatetimes(items, path = 'root') {
    items.forEach((item, index) => {
      const properties = item.properties;
      
      // Check published dates
      if (properties.published) {
        properties.published.forEach((date, dateIndex) => {
          if (typeof date === 'string') {
            // Check if it's a valid ISO date
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
              errors.push(`Invalid published date at ${path}[${index}].published[${dateIndex}]: ${date}`);
            }
          }
        });
      }
      
      // Check birthday dates
      if (properties.bday) {
        properties.bday.forEach((date, dateIndex) => {
          if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
              errors.push(`Invalid bday date at ${path}[${index}].bday[${dateIndex}]: ${date}`);
            }
          }
        });
      }
      
      // Recursively check children
      if (item.children) {
        checkDatetimes(item.children, `${path}[${index}].children`);
      }
    });
  }
  
  checkDatetimes(mfData.items);
  
  if (errors.length > 0) {
    return { 
      valid: false, 
      message: `Invalid datetime formats found: ${errors.join(', ')}`,
      errors 
    };
  }

  return { 
    valid: true, 
    message: 'All datetime properties are valid' 
  };
}

/**
 * Comprehensive microformats validation
 * @param {string} html - HTML content to validate
 * @param {object} options - Validation options
 * @returns {object} Complete validation result
 */
export function validateMicroformats(html, options = {}) {
  const {
    requireHCard = false,
    requireHEntry = false,
    requireHFeed = false,
    checkDatetimes = true
  } = options;

  const mfData = parseMicroformats(html);
  
  // Count h-entries including those in h-feed children
  let hEntryCount = mfData.items.filter(item => item.type.includes('h-entry')).length;
  const hFeeds = mfData.items.filter(item => item.type.includes('h-feed'));
  hFeeds.forEach(feed => {
    if (feed.children) {
      hEntryCount += feed.children.filter(child => child.type.includes('h-entry')).length;
    }
  });
  
  const results = {
    valid: true,
    summary: {
      hCard: mfData.items.filter(item => item.type.includes('h-card')).length,
      hEntry: hEntryCount,
      hFeed: mfData.items.filter(item => item.type.includes('h-feed')).length
    },
    validations: [],
    rawData: mfData
  };

  // Validate h-card if required or present
  if (requireHCard || results.summary.hCard > 0) {
    const hCardResult = validateHCard(mfData);
    results.validations.push({ type: 'h-card', ...hCardResult });
    if (!hCardResult.valid) results.valid = false;
  }

  // Validate h-entry if required or present
  if (requireHEntry || results.summary.hEntry > 0) {
    const hEntryResult = validateHEntry(mfData);
    results.validations.push({ type: 'h-entry', ...hEntryResult });
    if (!hEntryResult.valid) results.valid = false;
  }

  // Validate h-feed if required or present
  if (requireHFeed || results.summary.hFeed > 0) {
    const hFeedResult = validateHFeed(mfData);
    results.validations.push({ type: 'h-feed', ...hFeedResult });
    if (!hFeedResult.valid) results.valid = false;
  }

  // Validate datetime formats
  if (checkDatetimes) {
    const datetimeResult = validateDatetimes(mfData);
    results.validations.push({ type: 'datetime', ...datetimeResult });
    if (!datetimeResult.valid) results.valid = false;
  }

  return results;
}