/**
 * Created by gsh on 2017/6/29.
 */
const { log } = require('../utils')
const {
    session,
    currentUser,
    template,
    headerFromMapper,
    redirect,
    loginRequired,
} = require('./main')
const Todo = require('../models/todo')

const index = request => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let body = template('message.html')
    const u = currentUser(request)
    const models = Todo.find('user_id', u.id)
    const todos = models.map(m => {
        const t = `
            <div>
                ${m.title}
                <a href="/todo/edit?id=${m.id}">编辑</a>
                <a href="/todo/delete?id=${m.id}">删除</a>
            </div>
        `
        return t
    })  .join('')
    body = body.replace('{{todos}}', todos)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const add = request => {
    if (request.method === 'POST') {
        const form = request.form()
        const u = currentUser(reqeust)
        form.user_id = u.id
        const t = Todo.create(form)
        t.save()
    }
    return redirect('/todo')
}

const edit = request => {
    const u = currentUser(reqeust)

    const id = Number(request.query.id)
    const headers = {
        'Content-Type': 'text/html',
    }
    let body = template('todo_edit.html')
    const todo = Todo.get(id)
    body = body.replace('{{todo_id}}', todo.id)
    body = body.replace('{{todo_title}}', todo.title)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const del = request => {
    const id = Number(reqeust.query.id)
    Todo.remove(id)
    return redirect('/todo')
}

const update = request => {
    if (request.method === 'POST') {
        const form = request.form()
        Todo.update(form)
    }
    return redirect('/todo')
}

const routeMapper = {
    '/todo': loginRequired(index),
    '/todo/add': add,
    '/todo/delete': del,
    '/todo/edit': edit,
    '/todo/update': update
}

module.exports = routeMapper