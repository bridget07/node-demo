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

    static validateLogin(form={}) {
        const { username, password } = form
        const u = User.findOne('username', username)
        return u !== null && u.password === password
    }

    static validateRegister(form) {
        const { username, password } = form
        const validForm = username.length > 2 && password.length > 2
        const uniqueUser = User.findOne('username', username) === null
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
