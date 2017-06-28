const fs = require('fs')
const log = require('./utils')

const models = require('./models')
const User = models.User
const Message = models.Message

// 保存 session 信息
const session = {}

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

// 验证当前用户
const currentUser = request => {
    const id = request.cookies.user || ''
    const username = session[id] || '游客'
    return username
}

// 读取 html 文件的函数
const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

const headerFromMapper = (mapper={}) => {
    let base = 'HTTP/1.1 200 OK\r\n'
    const keys = Object.keys(mapper)
    const s = keys.map(k => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')
    const header = base + s
    return header
}

// 返回响应
const index = (request) => {
    // const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    let body = template('index.html')
    const username = currentUser(request)
    body = body.replace('{{username}}', username)
    const r = header + '\r\n' + body
    log('debug session index', session)
    return r
}

// login
const login = request => {
    let result
    // const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    const headers = {
        'Content-Type': 'text/html',
    }
    if (request.method === 'POST') {
        // 获取表单中的数据， 生成 User 实例
        const form = request.form()
        const u = User.create(form)
        if (u.validateLogin()) {
            const sid = randomStr()
            session[sid] = u.username
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }

    const username = currentUser(request)
    let body = template('login.html')
    body = body.replace('{{result}}',  result)
    body = body.replace('{{username}}',  username)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    log('debug session login', session)
    return r
}

// register
const register = request => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateRegister()) {
            // 如果合法，就保存到文件中
            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名或者密码长度必须大于2'
        }
    } else {
        result = ''
    }
    // const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    let body = template('register.html')
    body = body.replace('{{result}}',  result)
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    log('debug session register', session)
    return r
}

// 留言板
const message = request => {
    if (request.method === 'POST') {
        const form = request.form()
        const m = Message.create(form)
        m.save()
    }
    // const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    let body = template('message.html')
    const ms = Message.all()
    body = body.replace('{{messages}}',  ms)
    // log(' 替换后的 body', body)
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    log('debug session message', session)
    return r
}

// 静态资源的处理(图片)
const  static = (request) => {
    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    // const header = 'HTTP/1.1 200 OK\r\nContent-Type: img/gif\r\n\r\n'
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
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