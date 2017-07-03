const { log, error } = require('../utils')
const {
    currentUser,
    template,
    redirect,
    loginRequired,
    httpResponse
} = require('./main')

const User = require('../models/user')
const Weibo = require('../models/weibo')
const Comment = require('../models/comment')

const index = request => {
    const user_id = Number(request.query.user_id || -1)
    // log('****debug request', request)
    const u = User.get(user_id)
    const weibos = Weibo.find('user_id', u.id)
    log('****debug weibos', weibos)
    const body = template('weibo_index.html', {
        weibos: weibos,
        user: u
    })
    return httpResponse(body)
}

const create = request => {
    const body = template('weibo_new.html')
    return httpResponse(body)
}

const add = request => {
    const u = currentUser(request)
    const form = request.form()
    // log('****debug form', form)
    // create 加上 id 信息
    const w = Weibo.create(form)
    w.user_id = u.id
    w.save()
    return redirect(`/weibo/index?user_id=${u.id}`)
}

const del = request => {
    const weiboId = Number(request.query.id)
    Weibo.remove(weiboId)
    const u = currentUser(request)
    return redirect(`/weibo/index?user_id=${u.id}`)
}

const edit = request => {
    const weiboId = Number(request.query.id)
    const w = Weibo.get(weiboId)
    if (w === null) {
        return error()
    } else {
        const body = template('weibo_edit.html', {
            weibo: w
        })
        return httpResponse(body)
    }
}

const commentAdd = request => {
    const u = currentUser(request)
    const form = request.form()
    // form 里本身带有weibo——id 和 content
    const c = Comment.create(form)
    // 再加上 user_id
    c.user_id = u.id
    c.save()

    // 通过评论找到当前微博
    const w = c.weibo()
    // 通过这条微博找到发微博的人
    const user = w.user()
    log('****debug w user', w, user)
    return redirect(`/weibo/index?user_id=${user.id}`)
}

const routeWeibo = {
    '/weibo/index': loginRequired(index),
    '/weibo/new': loginRequired(create),
    '/weibo/add': add,
    '/weibo/delete': del,
    '/weibo/edit': edit,
    // '/weibo/update': update,
    '/comment/add': loginRequired(commentAdd)
}

module.exports = routeWeibo