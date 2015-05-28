var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	startPage = './static/index.html';

http.createServer(function (request, response) {
	console.log('request starting...');
	
	var filePath = '.' + request.url;
	console.log('file path ====> ' + filePath);
	if(filePath == './') {
		filePath = startPage;
	}
	
	console.log('request url =====> ' + request.url);
	console.log('file path ====> ' + filePath);	
	
	var extname = path.extname(filePath);
	var contentType = getContentType(extname);	
	
	path.exists(filePath, function (exists) {
		if(exists) {
			fs.readFile(filePath, function(error, content) {
				if(error) { 
					response.writeHead(500);
					response.end();
				} else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		} else {
            response.writeHead(404);
            response.end();
        }
	});	
}).listen(process.env.PORT || 5000);

function getContentType(extname) {
	var contentType = 'text/html';
	
	console.log('extansion name ====> ' + extname);
	
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.jpg':
			contentType = 'image/jpeg';
			break;
		case '.gif':
			contentType = 'image/gif';
			break;
	}
	console.log('content type ====> ' + contentType);
	console.log('========================================');
	return contentType
}

console.log('Server running at http://127.0.0.1:' + (process.env.PORT || 5000) + '/');


	