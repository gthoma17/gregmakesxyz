# Microformats Test Suite

This test suite validates that the Astro site is compliant with microformats standards when running under `astro dev`.

## Overview

The test suite automatically:
1. Starts an Astro development server
2. Fetches pages from the running server
3. Parses HTML for microformats using the `microformats-parser` library
4. Validates compliance with microformats standards
5. Stops the development server after testing

## Running the Tests

```bash
# Run all microformats tests
npm run test:microformats

# Run all tests (includes microformats tests)
npm test

# Run tests in watch mode
npm run test:watch
```

## What Is Tested

### Homepage (`/`)
- ✅ Valid h-card with required properties (name, photo)
- ✅ Valid h-entry structure 
- ✅ Author contact information (URL, email)
- ✅ Proper datetime formatting

### Posts Index (`/posts/`)
- ✅ Valid h-feed containing h-entry items
- ✅ Each h-entry has required properties (content, author, published date)
- ✅ Author h-card information
- ✅ Proper datetime formatting

### Notes Index (`/notes/`)
- ✅ Valid h-feed containing h-entry items
- ✅ Each h-entry has required properties (content, author, published date)
- ✅ Author h-card information  
- ✅ Proper datetime formatting

### Individual Posts/Notes
- ✅ Valid h-entry structure with content and author
- ✅ Proper datetime formatting for published dates

### General Validation
- ✅ All datetime properties use valid ISO 8601 format
- ✅ Author h-card has IndieWeb-compatible properties
- ✅ Microformats hierarchy is properly structured

## Microformats Classes Validated

The test suite validates these microformats classes:

- **h-card**: Author/profile information
- **h-entry**: Individual blog posts and notes
- **h-feed**: Content listing pages
- **p-name**: Names and titles
- **p-author**: Author references
- **p-nickname**: Author nicknames
- **u-photo**: Profile photos
- **u-url**: URLs
- **u-email**: Email addresses
- **dt-published**: Publication dates
- **dt-bday**: Birthday information
- **e-content**: Main content areas

## Test Structure

```
tests/
├── microformats.test.js     # Main test suite
└── utils/
    ├── server.js            # Astro dev server management
    └── microformats.js      # Microformats validation utilities
```

## Configuration

The test suite uses Vitest with these settings:
- 60-second timeout for server startup
- 30-second timeout for individual tests
- Automatic server cleanup after tests complete

## Troubleshooting

### Server Start Issues
If the Astro dev server fails to start:
1. Ensure the site builds correctly: `npm run build`
2. Check that port 4321 is available
3. Verify all dependencies are installed: `npm install`

### Validation Failures
If microformats validation fails:
1. Check the HTML output for missing classes
2. Verify datetime formats are ISO 8601 compliant
3. Ensure h-entry items have required content/author properties
4. Confirm h-feed contains h-entry children or siblings

### Adding New Tests

To add validation for new pages or microformats:

1. Add test cases to `tests/microformats.test.js`
2. Use the validation utilities in `tests/utils/microformats.js`
3. Follow the existing patterns for server interaction

Example:
```javascript
test('New page should have valid microformats', async () => {
  const html = await server.fetchPage('/new-page/');
  const result = validateMicroformats(html, {
    requireHEntry: true,
    checkDatetimes: true
  });
  
  expect(result.valid).toBe(true);
  expect(result.summary.hEntry).toBeGreaterThan(0);
});
```

## Dependencies

- **vitest**: Test framework
- **microformats-parser**: Microformats parsing library
- **playwright**: Browser automation (for potential future expansion)

## Benefits

This test suite ensures:
- ✅ IndieWeb compatibility
- ✅ Webmention support readiness
- ✅ Semantic markup compliance
- ✅ Consistent microformats across the site
- ✅ Early detection of markup regressions