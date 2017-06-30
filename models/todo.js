/**
 * Created by gsh on 2017/6/29.
 */
const { log } = require('../utils')

const Model = require('./main')

class Todo extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.done = false
        this.user_id = form.user_id
    }
     static update(form) {
         // log('***debug0,form', form)
         const id = Number(form.id)
        const t = this.get(id)
         // log('***debug1, t', t)
        t.title = form.title
         t.save()
    }
}

// test**********88

module.exports = Todo