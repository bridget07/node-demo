const Model = require('./main')
const User = require('./user')

class Weibo extends Model {
    constructor(form={}, user_id=-1) {
        super()
        this.id = form.id
        this.content = form.content || ''
        this.user_id = Number(form.user_id || user_id)
    }

    user() {
        // weibo 里的user_id 就是 用户 的id
        // 通过 weibo 里的user_id 来找到 用户(发微博的人)
        const u = User.findOne('id', this.user_id)
        return u
    }

    comments() {
        const Comment = require('./comment')
        const cs = Comment.find('weibo_id', this.id)
        return cs
    }
}

module.exports = Weibo