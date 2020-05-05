const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const Readable = require('stream').Readable
const port = 3000
const sendCount = 0

function RR(){
    Readable.call(this, arguments);
}
RR.prototype = new Readable();
RR.prototype._read = function(data) {}

const sse = (stream, event, data) => {
	// 结束部分必须是\n\n，因为一个换行符，标识当前消息并未结束，浏览器需要等待后面数据的到来后再触发事件
    return stream.push(`event:${event}\nid: 166\nretry: 1000\ndata: ${ JSON.stringify(data) }\n\n`)
}

// 设置跨域及响应内容类型
app.use(async (ctx, next) => {
    ctx.set({
    	'Access-Control-Allow-Origin': '*',
    	'Content-Type':'text/event-stream; charset=utf-8'
    })

    next()
})

// 不能加注释部分代码，否则前端获取不到数据
// app.use((ctx, next) => {
// 	ctx.body = 'it is just a eventsource test'
// })

router.get('/es', (ctx, next) => {
	const stream = new RR()
    sse(stream,'green',{ name: "misu",  age: 25});
    ctx.body = stream;

    // 3秒钟后推送另一条数据给前端
    setTimeout(() => {
    	sse(stream,'red',{ name: "jingtian", age: 18});
	    ctx.body = stream;
    }, 3000)
})

app.use(router.routes());

// 监听端口
app.listen(port, () => {
	console.log(`the server is running at port: ${port}`)
})