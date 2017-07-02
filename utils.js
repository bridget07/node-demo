const fs = require('fs')

const formattedTime = () => {
    const d = new Date()
    // const month = d.getMonth() + 1
    // const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()
    const t = `${hours}:${minutes}:${seconds}`
}


const log = (...args) => {
    const t = formattedTime()
    const arg = [t].concat(args)
    console.log.apply(console, args)

    const content = t + ' ' + args + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a'
    })
}

// 后台保存 session 信息
const randomStr = () => {
    const seed = 'qwertyuiopasdfghjklzxcvbnm1234567890'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * seed.length
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

// 出现错误的响应函数
const error = (request=null, code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>Not Found</h1>'
    }
    const r = e[code] || ''
    return r
}

// 用户 user id  session 加密所用的 key
const key = 'gsh'

module.exports.log = log
module.exports.randomStr = randomStr
module.exports.error = error
module.exports.key = key
