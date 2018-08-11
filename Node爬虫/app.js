// 引入模块
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var path = require('path');
var app = express();

// 设置跨域访问（直接访问页面时有效）
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 默认路由，返回默认页面
app.get('/', function(req, res, next) {
	// 设置响应文件类型
	res.header({'Content-Type': 'text/html'});
	res.sendFile(path.resolve(__dirname, './app.html'));
})

// 返回爬虫数据
app.get('/list', function(req, res, next) {
	superagent.get('https://cnodejs.org/').end(function(err, data) {
		if (err) {
			return next(err);
		}

		var $ = cheerio.load(data.text);
		var items = [];
		$('#topic_list .topic_title').each(function(index, ele) {
			var $element = $(ele);

			items.push({
				title: $element.attr('title'),
				href: 'https://cnodejs.org'+ $element.attr('href')
			})
		})

		res.sendFile(path.join(__dirname, './app.html'));
		res.send(items);
	})
})

// 端口监听
app.listen(3000, function() {
  console.log('The server is runing at port: 3000');
})
