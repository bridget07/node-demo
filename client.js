
const net = require('net')

// 此处为要连接的服务器的信息
// const host = '0.0.0.0'
// const port = 2001

const host = 'music.163.com'
const port = 80

const client = new net.Socket()
client.connect(port, host, () => {
    console.log('connect to: ', host, port)
    // const request = 'data from client'
    const request = 'HTTP / '
    client.write(request)
    // setInterval(() => {
    //     client.write('hello in interval')
    // }, 100)
})

client.on('data', (data) => {
    console.log('data', data.toString())
    // client.destroy()
})

client.on('close', function() {
    console.log('connection closed')
})
