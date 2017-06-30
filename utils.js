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

    fs.writeFileSync('log.txt', args, {
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

module.exports.log = log
module.exports.randomStr = randomStr
