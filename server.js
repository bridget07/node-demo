const net = require('net')

// 服务器的 host 为空字符串, 表示接受任意 ip 地址的连接
const host = ''
const port = 2001

const server = new net.Server()
// 开启服务器监听连接
server.listen(port, host, () => {
 // server.address() 返回的是绑定的服务器的 ip 地址、ip 协议、端口号
 console.log('listening, ', server.address())
})

server.on('connection', (socket) => {
    const adddress = socket.remoteAddress
    const port = socket.remotePort
    const family = socket.remoteFamily
    console.log('connected client info', address, port, family)

    socket.on('data', (data) => {
        const r = data.toString()
        console.log('接收到的原始数据', r)

        const response = 'hello World'
        socket.write(response)
        // socket.destroy()
    })
})
server.on('error', (error) => {
    console.log('server error', error)
})
server.on('close', () => {
    console.log('server closed')
})