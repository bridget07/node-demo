const fs = require('fs')
const log = require('./utils')

const models = require('./models')
const User = models.User
const Message = models.Message

// 保存 message 信息
const MessageList = []

// 读取 html 文件的函数
const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

// 返回响应
const index = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    const body = template('index.html')
    const r = header + body
    return r
}

// login
const login = request => {
    let result
    if (request.method === 'POST') {
        // 获取表单中的数据， 生成 User 实例
        const form = request.form()
        const u = User.create(form)
        if (u.ValidateLogin()) {
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    let body = template('login.html')
    body = body.replace('{{result}}',  result)
    const r = header + body
    return r
}

// register
const register = request => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.ValidateRegister()) {
            // 如果合法，就保存到文件中
            u.save()
            const us = User.all()
            result = '注册成功<br><pre>${us}</pre>>'
        } else {
            result = '用户名或者密码长度必须大于2'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    let body = template('register.html')
    body = body.replace('{{result}}',  result)
    const r = header + body
    return r
}

// 留言板
const message = request => {
    if (request.method === 'POST') {
        const form = request.form()
        const m = Message.create(form)
        m.save()
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    let body = template('message.html')
    const ms = Message.all()
    body = body.replace('{{messages}}',  ms)
    const r = header + body
    return r
}

// 静态资源的处理(图片)
const  static = (request) => {
    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: img/gif\r\n\r\n'

    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

const routeMapper = {
    '/': index,
    '/static': static,
    '/login': login,
    '/register': register,
    '/message': message
}

module.exports = routeMapper