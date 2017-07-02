/**
 * Created by gsh on 2017/6/29.
 */
const fs = require('fs')
const { log } = require('../utils')

const {
    session,
    currentUser,
    template,
    headerFromMapper
} = require('./main')

// 返回响应
const index = (request) => {
    const u = currentUser(request)
    const username = u ? u.username: ''
    let body = template('index.html', {
        username: username
    })
    return httpReponse(body)
}

// 静态资源的处理(图片)
const  static = (request) => {
    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const favicon = request => {
    const filename = 'favicon.ico'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const routeIndex = {
    '/': index,
    '/static': static,
    '/favicon.ico': favicon
}

module.exports = routeIndex