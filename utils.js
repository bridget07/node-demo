const log = (...args) => {
    console.log.apply(console, args)
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
