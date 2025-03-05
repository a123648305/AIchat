const http = require('http');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const server = http.createServer(async (req, res) => {
  const result = await fs.promises.readFile(path.resolve('package.json'), 'utf8');
  if (req.url === '/test') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Example: Send a message every 5 seconds
    const intervalId = setInterval(() => {
      sendEvent({ message: 'This is a server-sent event', time: new Date().toLocaleString() });
    }, 1200);

    // Clean up when the connection is closed
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  }

  if (req.url === '/file') {
    const result = await fs.readFile(path.resolve('package.json'), 'utf8');
    console.log(result, 'read');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(result);
  }
  if (req.url === '/stream') {
    // Create a readable stream
    const readableStream = new Readable({
      async read(size) {
        this.push('Hello, this is a stream of data!\n');
        this.push(result);
        this.push(null); // Signal the end of the stream
      },
    });

    // Set headers for the response
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Pipe the readable stream to the response
    readableStream.pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  }
});
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
