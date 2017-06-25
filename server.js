const net = require('net')
const fs =  require('fs')

const log = (...args) => {
    console.log.apply(console, args)
}
/*
// 服务器的 host 为空字符串, 表示接受任意 ip 地址的连接
const host = ''
const port = 2001
*/

// 响应函数
const routeIndex = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    const body = '<h1>HELLO WORLD!</h1><img src="doge.gif">'

    const r = header + body
    return r
}
const routeImage = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: img/gif\r\n\r\n'
    const file = 'doge.gif'
    const body = fs.readFileSync(file)

    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

// 出现错误的响应函数
const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>Not Found</h1>'
    }
    const r = e[code] || ''
    return r
}

// 根据请求路径返回相应的响应函数
const responseForPath = (path) => {
    const r = {
        '/': routeIndex,
        '/doge.gif': routeImage
    }
    const response = r[path] || error
    return response()
}

const run = (host='', port=3000) => {
    const server = new net.Server()
    // 开启服务器监听连接
    server.listen(port, host, () => {
        // server.address() 返回的是绑定的服务器的 ip 地址、ip 协议、端口号
        console.log('listening: ', server.address())
    })

    server.on('connection', (socket) => {
        const address = socket.remoteAddress
        const port = socket.remotePort
        const family = socket.remoteFamily
        console.log('connected client info(address:ipremote)', address, port, family)

        socket.on('data', (data) => {
            const request = data.toString()

            const ipLocal = socket.localAddress
            log(`ipLocal and request, ipLocal 的值: ${ipLocal}\nrequest 的内容\n${request}`)

            const path = request.split(' ')[1]
            log('path: ', path)
            const response = responseForPath(path)
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
    run('', 2200)
}
__main()