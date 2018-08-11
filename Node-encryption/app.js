// 引入模块
var express = require('express');
var utility = require('utility');
var app = express();

app.get('/', function(req, res) {
	var key = req.query.key;
	console.log(key);

	var md5 = utility.md5(key);
	var base64 = utility.sha1(key, 'base64');
	var sha1 = utility.sha1(key);
	var sha256 = utility.sha256(new Buffer(key));
	var hmac = utility.hmac('sha1', key, '');

	var encryptData = {
		md5,
		sha1,
		base64,
		sha256,
		hmac,
	};

    res.send(encryptData);
})

// 端口监听
app.listen(3000, function() {
  console.log('The server is runing at port: 3000');
})
