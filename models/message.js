/**
 * Created by gsh on 2017/6/29.
 */
const Model = require('./main')

class Message extends Model {
    constructor(form={}) {
        super()
        this.author = form.author || ''
        this.content = form.content || ''
    }
}

module.exports = Message