// 内置模块
const net = require('net')
const fs =  require('fs')

// 自定义模块
const log = require('./utils')
const Request = require('./request')
const routeMapper = require('./routes')

// 出现错误的响应函数
const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>Not Found</h1>'
    }
    const r = e[code] || ''
    return r
}

// 解析 path
const parsedPath = path =>{
    const index = path.indexOf('?')
    if (index === -1) {
        return {
            path: path,
            query: {}
        }
    } else {
        const l = path.split('?')
        path = l[0]

        const search = l[1]
        const args = search.split('&')
        const query = {}
        for (let arg of args) {
            const [k, v] = arg.split('=')
            query[k] = v
        }
        return {
            path: path,
            query: query
        }
    }
}

// 解析请求原文， 找到对应的响应函数
const responseFor = (r, request) => {
    const raw = r
    const raws = raw.split(' ')

    // request 是自定义的对象，使用这个对象来保存请求的相关信息（method, path, query, body）
    request.raw = r
    request.method = raws[0]
    let pathname = raws[1]
    let { path, query } = parsedPath(pathname)
    request.path = path
    request.query = query
    request.body = raw.split('\r\n\r\n')[1]
    log('path and query: ', path, query)
    // 找到对应的响应函数
    const route = {}
    const routes = Object.assign(route, routeMapper)
    const response =  routes[path] || error
    const resp = response(request)
    return resp
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
        // log(`listening at http://${address.address}:${address.port}`)
    })

    server.on('connection', (socket) => {
        // const address = socket.remoteAddress
        // const port = socket.remotePort
        // const family = socket.remoteFamily
        // console.log('connected client info(address:ipremote)', address, port, family)

        socket.on('data', (data) => {
            const request = new Request()
            const r = data.toString('utf8')
            request.raw = r

            const ipLocal = socket.localAddress
            log(`ipLocal and request, ipLocal 的值: ${ipLocal}\nrequest 的内容\n${r}`)

            const response = responseFor(r, request)
            socket.write(response)
            socket.destroy()
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
    run('', 2300)
}

//唯一入口
__main()