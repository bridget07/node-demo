const Model = require('./main')
const User = require('./user')
const Weibo = require('./weibo')

class Comment extends Model {
    constructor(form={}, user_id=-1) {
        super()
        this.id = form.id
        this.content = form.content || ''
        this.user_id = Number(form.user_id || user_id)
        this.weibo_id = Number(form.weibo_id || -1)
    }

    user() {
        const u = User.findOne('id', this.user_id)
        return u
    }

    weibo() {
        // comment 里的weibo_id 就是 weibo 的id
        // 通过comment 里的weibo_id 来找 weibo 的id
        const w = Weibo.findOne('id', this.weibo_id)
        return w
    }
}

module.exports = Comment