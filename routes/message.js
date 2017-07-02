const { log } = require('../utils')

const {
    template,
    httpResponse
} = require('./main')

const Message = require('../models/message')

// 留言板
const message = request => {
    if (request.method === 'POST') {
        const form = request.form()
        const m = Message.create(form)
        m.save()
    }
    const ms = Message.all()
    const body = template('message.html', {
        messages: ms,
    })
    return httpResponse(body)
}

const routeMessage = {
    '/message': message
}

module.exports = routeMessage