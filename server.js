const http = require('http');

const hostname = 'localhost';
const port = 3000;

const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);

    if (req.method === 'GET') {
        let fileUrl = req.url;
        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }

        const filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);

        if (fileExt === '.html') {
            fs.access(filePath, err => { //checks if a file is accessible
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html'); //Tells the client to expect an HTML file.
                    res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');

                fs.createReadStream(filePath).pipe(res); //This method takes care of reading the contents of the file it’s given in small chunks, instead of all at once. So it doesn’t load it all into memory. .pipe(res) means we are sending it over to the response object. 
                //Pipe method is available on Node streams. The response object is a special type of object called a stream. createReadStream also creates a stream. When you have two stream objects, you can use the pipe method to send one stream to another. We are piping the data to the response stream here.
            });
        } else { //if the fileExt is not html:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`);
        }
    } else { //request type invalid.
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});