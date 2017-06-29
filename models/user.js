/**
 * Created by gsh on 2017/6/29.
 */
const Model = require('./main')

const { log } = require('../utils')


class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.id = form.id
        this.note = form.note || ''
    }

    validateLogin() {
        log(this, this.username, this.password)
        const u = User.findOne('username', this.username)
        return u !== null && u.password === this.password
    }

    validateRegister() {
        const validForm = this.username.length > 2 && this.password.length > 2
        const uniqueUser = User.findOne('username', this.username) === null
        return validForm && uniqueUser
    }
}


module.exports = User

/*
 const test = () => {
 const form = {
 username: 'gua',
 password: '123'
 }
 const u = User.create(form)
 u.save()
 }
 test()
 */
