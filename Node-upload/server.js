const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const upload = multer({dest: 'photos/'});
const port = process.env.port || 3000;

app.use(express.static(__dirname + '/public'));

// 默认路由，返回默认网页
app.get('/', (req, res) => {
	res.header({'Content-Type': 'text/html'});
	res.sendFile(path.join(__dirname, './index.html'));
});

// 允许传入文本及单个字段的多个文件
app.post('/single', upload.array('avatar', 3), (req, res) => {
	console.log(req.files);
	console.log(req.body);
});

// 允许传入文本及多个字段的多个文件
const fields = upload.fields([
	{name: 'avatar'},
	{name: 'photo', maxCount: 3},
]);

app.post('/muti', fields, (req, res) => {
	console.log(req.files);
	console.log(req.body);
	res.status(200);
	res.json(req.body);
});

// 仅允许传入文本
const none = upload.none();

app.post('/plain', none, (req, res) => {
	console.log(req.body);
	res.status(200);
	res.json(req.body);
});

// 允许传入文本及多个字段的多个文件，无限制
const any = upload.any();

app.post('/form', any, (req, res) => {
	console.log(req.files);
	console.log(req.body);
	res.status(200);
	res.json(req.body);
});

app.listen(port, function() {
	console.log(`The server is running at port: ${port}`);
})