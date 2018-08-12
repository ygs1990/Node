// 引入模块
var express = require('express');
var async = require('async');
var app = express();

var currentConCount = 0;
var fetchUrl = function(url, callback) {
	var delay = parseInt((Math.random() * 10000000) % 2000, 10);
	currentConCount++;
	console.log('现在的并发数是：', currentConCount, '，正在抓取的是', url, '，耗时'+ delay +' 毫秒');

	setTimeout(function() {
		currentConCount--;
		callback(null, url +'html content');
	}, delay)
};

var urls = [];
for(var i = 0; i < 30; i++) {
	urls.push('http://datasource_'+ i);
}

async.mapLimit(urls, 5, function(url, callback) {
	fetchUrl(url, callback);
}, function(err, result) {
	console.log('Final: ');
	console.log(result);
})

// 端口监听
app.listen(3000, function() {
  console.log('The server is runing at port: 3000');
})
