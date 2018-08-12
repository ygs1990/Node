// 引入模块
var express = require('express');
var superAgent = require('superagent');
var eventProxy = require('eventproxy');
var cheerio = require('cheerio');
var path = require('path');
var url = require('url');
var app = express();

var cnodeUrl = 'https://cnodejs.org/';

superAgent.get(cnodeUrl).end(function(err, res) {
	if (err) {
		return console.error(err);
	}

	var topicUrls = [];
	var $ = cheerio.load(res.text);

	$('#topic_list .topic_title').each(function(index, element) {
		var $element =  $(element);
		var href = url.resolve(cnodeUrl, $element.attr('href'));
		topicUrls.push(href);
	})

	var ep = new eventProxy();

	ep.after('topicHtml', topicUrls.length, function(topics) {
		topics = topics.map(function(topic) {
			var topicUrl = topic[0];
			var topicHtml = topic[1];
			var $ = cheerio.load(topicHtml);

			return ({
				title: $('.topic_full_title').text().trim(),
				href: topicUrl,
				comment: $('.reply_content').eq(0).text().trim()
			});
		});

		console.log('final: ');
		console.log(topics);
	});

	topicUrls.forEach(function(topicUrl) {
		superAgent.get(topicUrl).end(function(err, res) {
			console.log('Fetch '+ topicUrl +' successful');
			ep.emit('topicHtml', [topicUrl, res.text])
		});
	});
});


// 端口监听
app.listen(3000, function() {
  console.log('The server is runing at port: 3000');
})
