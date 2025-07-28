import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

class AstroDevServer {
  constructor() {
    this.process = null;
    this.isRunning = false;
    this.baseUrl = 'http://localhost:4321';
  }

  async start() {
    if (this.isRunning) {
      return;
    }

    console.log('Starting Astro dev server...');
    
    // Start the astro dev server
    this.process = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'development' }
    });

    let serverReady = false;
    
    // Wait for server to be ready
    this.process.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Server output:', output);
      if (output.includes('Local') && output.includes('4321')) {
        serverReady = true;
      }
    });

    this.process.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    this.process.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
      this.isRunning = false;
    });

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max wait
    while (!serverReady && attempts < maxAttempts) {
      await setTimeout(1000);
      attempts++;
      
      // Also try to check if server is responding
      try {
        const response = await fetch(this.baseUrl);
        if (response.ok) {
          serverReady = true;
        }
      } catch (error) {
        // Server not ready yet
      }
    }

    if (!serverReady) {
      throw new Error('Astro dev server failed to start within 30 seconds');
    }

    this.isRunning = true;
    console.log('Astro dev server is ready!');
  }

  async stop() {
    if (this.process && this.isRunning) {
      console.log('Stopping Astro dev server...');
      this.process.kill('SIGTERM');
      
      // Wait a bit for graceful shutdown
      await setTimeout(2000);
      
      if (this.process.killed === false) {
        this.process.kill('SIGKILL');
      }
      
      this.isRunning = false;
    }
  }

  async fetchPage(path = '/') {
    if (!this.isRunning) {
      throw new Error('Server is not running');
    }
    
    const url = `${this.baseUrl}${path}`;
    console.log(`Fetching page: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    
    return response.text();
  }
}

// Singleton instance
let serverInstance = null;

export function getServerInstance() {
  if (!serverInstance) {
    serverInstance = new AstroDevServer();
  }
  return serverInstance;
}

export async function startDevServer() {
  const server = getServerInstance();
  await server.start();
  return server;
}

export async function stopDevServer() {
  const server = getServerInstance();
  await server.stop();
}