const { log, randomStr } = require('../utils')
const {
    currentUser,
    template,
    loginRequired,
    httpResponse,
} = require('./main')
const session = require('../models/session')
const User = require('../models/user')


// login
const login = request => {
    let result
    const headers = {}
    if (request.method === 'POST') {
        // 获取表单中的数据， 生成 User 实例
        const form = request.form()
        const u = User.findOne('username', form.username)
        if (u !== null && u.validateAuth(form)) {
            const form =  {
                uid: u.id
            }
            const s = session.encrypt(form)
            headers['Set-Cookie'] = `session=${s}`
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
    return httpResponse(body, headers)
}

// register
const register = request => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.register(form)
        if (u !== null) {
            result = '注册成功'
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
    return httpResponse(body)
}

const profile = request => {
    const u = currentUser(request)
    let body = template('profile.html', {
        user: u
    })
    return httpResponse(body)
}
 const routeUser = {
    '/login': login,
     '/register': register,
     '/profile': loginRequired(profile),
 }

 module.exports = routeUser