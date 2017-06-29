/**
 * Created by gsh on 2017/6/29.
 */

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
        const id = Number(form.id)
        const t = this.get(id)
        t.title = form.title
        t.save()
    }
}

// test**********88

module.exports = Todo