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
    const headers = {
        'Content-Type': 'text/html',
    }
    if (request.method === 'POST') {
        // 获取表单中的数据， 生成 User 实例
        const form = request.form()
        if (User.validateLogin(form)) {
            const u = User.create(form)
            u.save()
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
    let body = template('login.html', {
        username: username,
        result: result,
    })
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

// register
const register = request => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        if (User.validateRegister(form)) {
            const u = User.create(form)
            // 如果合法，就保存到文件中
            u.save()
            result = `注册成功`
        } else {
            result = '用户名或者密码长度必须大于2'
        }
    } else {
        result = ''
    }
    const us = User.all()
    let body = template('register.html', {
        result: result,
        users: us
    })
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const profile = request => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const u = currentUser(request)
    let body = template('profile.html', {
        user: u
    })
    const r = header + '\r\n' + body
    return r
}
 const routeUser = {
    '/login': login,
     '/register': register,
     '/profile': loginRequired(profile),
 }

 module.exports = routeUser