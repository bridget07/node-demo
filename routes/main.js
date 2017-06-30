const fs = require('fs')
const { log } = require('../utils')
const nunjucks = require('nunjucks')

const User = require('../models/user')


// 保存 session 信息
const session = {}

// 配置 nunjucks
const loader = new nunjucks.FileSystemLoader('templates', {
    noCache: true
})

const env = new nunjucks.Environment(loader)


// 验证当前用户
const currentUser = request => {
    const id = request.cookies.user || ''
    const username = session[id]
    const u = User.findOne('username', username)
    return u
}

// 读取 html 文件的函数
const template = (path, data) => {
    const s = env.render(path, data)
    return s
}

const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK\r\n`
    const keys = Object.keys(mapper)
    const s = keys.map(k => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')
    const header = base + s
    return header
}


// 静态资源的处理(图片)
const  static = (request) => {
    const filename = request.query.file || 'doge.gif'
    const path = `../static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()

    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

// 重定向
const redirect = url => {
    const headers = {
        Location: url,
    }
    const header = headerFromMapper(headers, 302)
    const r = header + '\r\n'
    return r
}

// 检测是否登录
const loginRequired = routeFunc => {
    const func = request => {
        const u = currentUser(request)
        if (u === null) {
            return redirect('/login')
        } else {
            return routeFunc(request)
        }
    }
    return func
}


module.exports = {
    session: session,
    currentUser: currentUser,
    template: template,
    headerFromMapper:headerFromMapper,
    static: static,
    redirect: redirect,
    loginRequired: loginRequired
}