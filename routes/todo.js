const { log } = require('../utils')
const {
    currentUser,
    template,
    httpResponse,
    redirect,
    loginRequired,
} = require('./main')
const Todo = require('../models/todo')

const index = request => {
    const u = currentUser(request)
    const models = Todo.find('user_id', u.id)
    log('*****debug, models', models)
    const body = template('todo_index.html', {
        todos: models,
    })
    return httpResponse(body)
}

const add = request => {
    if (request.method === 'POST') {
        const form = request.form()
        const u = currentUser(request)
        const t = Todo.create(form)
        t.save()
    }
    return redirect('/todo')
}

const edit = request => {
    const u = currentUser(request)
    const id = Number(request.query.id)
    const todo = Todo.get(id)
    const body = template('todo_edit.html', {
        todo: todo
    })
    return httpResponse(body)
}

const del = request => {
    const id = Number(request.query.id)
    Todo.remove(id)
    return redirect('/todo')
}

const update = request => {
    if (request.method === 'POST') {
        const form = request.form()
        // form.id = request.headers.Referer.split('=')[1]
        // log('***debug request', request)
        Todo.update(form)
    }
    return redirect('/todo')
}

const routeMapper = {
    '/todo': index,
    '/todo/add': add,
    '/todo/delete': del,
    '/todo/edit': edit,
    '/todo/update': update
}

module.exports = routeMapper