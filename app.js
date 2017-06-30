// 内置模块
const net = require('net')
const fs =  require('fs')

// 自定义模块
const { log } = require('./utils')
const Request = require('./request')

const routeIndex = require('./routes/index')
const routeUser = require('./routes/user')
const routeMessage= require('./routes/message')
const routeTodo = require('./routes/todo')



// 出现错误的响应函数
const error = (request=null, code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>Not Found</h1>'
    }
    const r = e[code] || ''
    return r
}


// 解析请求原文， 找到对应的响应函数
const responseFor = (raw, request) => {
    // log('***debug raw request,', raw, request)
    // 找到对应的响应函数
    const route = {}
    const routes = Object.assign(route, routeIndex, routeUser, routeMessage, routeTodo)
    const response =  routes[request.path] || error
    const resp = response(request)
    return resp
}

const processRequest = (data, socket) => {
    const raw = data.toString('utf8')
    const request = new Request(raw)
    const ip = socket.localAddress
    log(`ip and request, ${ip}\n${raw}`)

    const response = responseFor(raw, request)
    socket.write(response)
    socket.destroy()
}


/*
 // 服务器的 host 为空字符串, 表示接受任意 ip 地址的连接
 const host = ''
 const port = 2001
 */
const run = (host='', port=3000) => {
    const server = new net.Server()
    // 开启服务器监听连接
    server.listen(port, host, () => {
        // server.address() 返回的是绑定的服务器的 ip 地址、ip 协议、端口号
        const address = server.address()
        log(`listening at http://${address.address}:${address.port}`)
    })

    server.on('connection', (s) => {
        // const address = socket.remoteAddress
        // const port = socket.remotePort
        // const family = socket.remoteFamily
        // console.log('connected client info(address:ipremote)', address, port, family)
        s.on('data', data => {
            processRequest(data, s)
        })

    })
    server.on('error', (error) => {
        console.log('server error', error)
    })
    server.on('close', () => {
        console.log('server closed')
    })

}


const __main = () => {
    run('127.0.0.1', 2300)
}

if (require.main === module) {
    __main()
}

