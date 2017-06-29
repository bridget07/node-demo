/**
 * Created by gsh on 2017/6/29.
 */
const { log, randomStr } = require('../utils')
const {
    session,
    currentUser,
    template,
    loginRequired,
    headerFromMapper,
} = require('./main')

const User = require('../models/user')


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

    const u = currentUser(request)
    const username = u ? u.username: ''
    let body = template('login.html')
    body = body.replace('{{result}}',  result)
    body = body.replace('{{username}}',  username)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    // log('debug session login', session)
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

const profile = request => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    let body = template('profile.html')
    const u = currentUser(request)
    body = body.replace('{{username}}', u.username)
    body = body.replace('{{password}}', u.password)
    body = body.replace('{{note}}', u.note)
    const r = header + '\r\n' + body
    return r
}
 const routeUser = {
    '/login': login,
     '/register': register,
     '/profile': loginRequired(profile),
 }

 module.exports = routeUser