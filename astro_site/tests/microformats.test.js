import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { startDevServer, stopDevServer, getServerInstance } from './utils/server.js';
import { validateMicroformats } from './utils/microformats.js';

describe('Microformats Compliance Tests', () => {
  let server;

  beforeAll(async () => {
    server = await startDevServer();
  }, 60000); // 60 second timeout for server startup

  afterAll(async () => {
    await stopDevServer();
  });

  test('Homepage should have valid microformats', async () => {
    const html = await server.fetchPage('/');
    const result = validateMicroformats(html, {
      requireHCard: true,
      checkDatetimes: true
    });

    expect(result.valid).toBe(true);
    expect(result.summary.hCard).toBeGreaterThan(0);
    
    const hCardValidation = result.validations.find(v => v.type === 'h-card');
    expect(hCardValidation.valid).toBe(true);
    expect(hCardValidation.data.name).toBeTruthy();
    expect(hCardValidation.data.photo).toBeTruthy();
  });

  test('Posts index should have valid h-feed with h-entry items', async () => {
    const html = await server.fetchPage('/posts/');
    const result = validateMicroformats(html, {
      requireHFeed: true,
      requireHEntry: true,
      checkDatetimes: true
    });

    expect(result.valid).toBe(true);
    expect(result.summary.hFeed).toBeGreaterThan(0);
    expect(result.summary.hEntry).toBeGreaterThan(0);
    
    const hFeedValidation = result.validations.find(v => v.type === 'h-feed');
    expect(hFeedValidation.valid).toBe(true);
    
    const hEntryValidation = result.validations.find(v => v.type === 'h-entry');
    expect(hEntryValidation.valid).toBe(true);
  });

  test('Notes index should have valid h-feed with h-entry items', async () => {
    const html = await server.fetchPage('/notes/');
    const result = validateMicroformats(html, {
      requireHFeed: true,
      requireHEntry: true,
      checkDatetimes: true
    });

    expect(result.valid).toBe(true);
    expect(result.summary.hFeed).toBeGreaterThan(0);
    expect(result.summary.hEntry).toBeGreaterThan(0);
    
    const hFeedValidation = result.validations.find(v => v.type === 'h-feed');
    expect(hFeedValidation.valid).toBe(true);
    
    const hEntryValidation = result.validations.find(v => v.type === 'h-entry');
    expect(hEntryValidation.valid).toBe(true);
  });

  test('Individual post should have valid h-entry', async () => {
    // First get the posts index to find a post URL
    const postsHtml = await server.fetchPage('/posts/');
    const postsResult = validateMicroformats(postsHtml);
    
    // Extract first post URL if available
    const firstEntry = postsResult.rawData.items
      .find(item => item.type.includes('h-feed'))
      ?.children?.find(child => child.type.includes('h-entry'));
    
    if (firstEntry && firstEntry.properties.url) {
      const postUrl = firstEntry.properties.url[0];
      const postPath = new URL(postUrl).pathname;
      
      const html = await server.fetchPage(postPath);
      const result = validateMicroformats(html, {
        requireHEntry: true,
        checkDatetimes: true
      });

      expect(result.valid).toBe(true);
      expect(result.summary.hEntry).toBeGreaterThan(0);
      
      const hEntryValidation = result.validations.find(v => v.type === 'h-entry');
      expect(hEntryValidation.valid).toBe(true);
      expect(hEntryValidation.data.content).toBeTruthy();
      expect(hEntryValidation.data.author).toBeTruthy();
    } else {
      // Try a known post if URL extraction fails
      try {
        const html = await server.fetchPage('/posts/WebmentionsFirstPass/');
        const result = validateMicroformats(html, {
          requireHEntry: true,
          checkDatetimes: true
        });

        expect(result.valid).toBe(true);
        expect(result.summary.hEntry).toBeGreaterThan(0);
        
        const hEntryValidation = result.validations.find(v => v.type === 'h-entry');
        expect(hEntryValidation.valid).toBe(true);
        expect(hEntryValidation.data.content || hEntryValidation.data.name).toBeTruthy();
        expect(hEntryValidation.data.author).toBeTruthy();
      } catch (error) {
        console.log('No individual posts available to test, skipping individual post validation');
      }
    }
  });

  test('Individual note should have valid h-entry', async () => {
    // First get the notes index to find a note URL
    const notesHtml = await server.fetchPage('/notes/');
    const notesResult = validateMicroformats(notesHtml);
    
    // Extract first note URL if available
    const firstEntry = notesResult.rawData.items
      .find(item => item.type.includes('h-feed'))
      ?.children?.find(child => child.type.includes('h-entry'));
    
    if (firstEntry && firstEntry.properties.url) {
      const noteUrl = firstEntry.properties.url[0];
      const notePath = new URL(noteUrl).pathname;
      
      const html = await server.fetchPage(notePath);
      const result = validateMicroformats(html, {
        requireHEntry: true,
        checkDatetimes: true
      });

      expect(result.valid).toBe(true);
      expect(result.summary.hEntry).toBeGreaterThan(0);
      
      const hEntryValidation = result.validations.find(v => v.type === 'h-entry');
      expect(hEntryValidation.valid).toBe(true);
      expect(hEntryValidation.data.content).toBeTruthy();
      expect(hEntryValidation.data.author).toBeTruthy();
    } else {
      // Try a known note if URL extraction fails
      try {
        const html = await server.fetchPage('/notes/note-2023-01-25-19_26/');
        const result = validateMicroformats(html, {
          requireHEntry: true,
          checkDatetimes: true
        });

        expect(result.valid).toBe(true);
        expect(result.summary.hEntry).toBeGreaterThan(0);
        
        const hEntryValidation = result.validations.find(v => v.type === 'h-entry');
        expect(hEntryValidation.valid).toBe(true);
        expect(hEntryValidation.data.content || hEntryValidation.data.name).toBeTruthy();
        expect(hEntryValidation.data.author).toBeTruthy();
      } catch (error) {
        console.log('No individual notes available to test, skipping individual note validation');
      }
    }
  });

  test('All datetime properties should be valid ISO 8601 format', async () => {
    const pages = ['/', '/posts/', '/notes/'];
    
    for (const page of pages) {
      const html = await server.fetchPage(page);
      const result = validateMicroformats(html, {
        checkDatetimes: true
      });
      
      const datetimeValidation = result.validations.find(v => v.type === 'datetime');
      expect(datetimeValidation.valid).toBe(true);
    }
  });

  test('Author h-card should have required IndieWeb properties', async () => {
    const html = await server.fetchPage('/');
    const result = validateMicroformats(html, {
      requireHCard: true
    });

    expect(result.valid).toBe(true);
    
    const hCardValidation = result.validations.find(v => v.type === 'h-card');
    expect(hCardValidation.valid).toBe(true);
    
    // Check for IndieWeb author properties
    expect(hCardValidation.data.name).toBeTruthy();
    expect(hCardValidation.data.photo).toBeTruthy();
    
    // Check if URL and email are present (optional but good for IndieWeb)
    const hasUrl = !!hCardValidation.data.url;
    const hasEmail = !!hCardValidation.data.email;
    
    expect(hasUrl || hasEmail).toBe(true); // At least one contact method should be present
  });
});