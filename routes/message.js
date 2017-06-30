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
        const form = request.form()
        const m = Message.create(form)
        m.save()
        log('m***debug  save', m)
    }
    const ms = Message.all()
    const body = template('message.html', {
        messages: ms,
    })
    const headers = {
        'Content-Type': 'text/html'
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