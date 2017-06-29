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

const Message = require('../models/message')

// 留言板
const message = request => {
    if (request.method === 'POST') {
        log('*****debug request.method', request.method)
        const form = request.form()
        const m = Message.create(form)
        m.save()
        log('m***debug  save', m)
    }
    log('*****debug ', request.method)

    // const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n'
    let body = template('message.html')
    const ms = Message.all()
    log('ms********debug', ms)
    body = body.replace('{{messages}}',  ms)
    // log(' 替换后的 body', body)
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    // log('debug session message', session)
    return r
}

const routeMessage = {
    '/message': message
}

module.exports = routeMessage