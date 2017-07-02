const Model = require('./main')
const crypto = require('crypto')
const { log } = require('../utils')


class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.id = form.id
        this.note = form.note || ''
    }

    static create(form={}) {
        form.password = this.saltedPassword(form.password)
        const u = super.create(form)
        u.save()
        return u
    }

    static saltedPassword(password, salt='gsh') {
        function _sha1(s) {
            const algorithm = 'sha1'
            const hash = crypto.createHash(algorithm)
            hash.update(s)
            const h = hash.digest('hex')
            return h
        }
        const hash1 = _sha1(password)
        const hash2 = _sha1(hash + salt)
        return hash2
    }

    validateAuth(form) {
        const cls = this.constructor
        const { username, password } = form
        const pwd = cls.saltedPassword(password)
        const usernameEquals = this.username === username
        const passwordEquals = this.password === pwd
        return usernameEquals && passwordEquals
    }

    static login(form={}) {
        const { username, password } = form
        const pwd = this.saltedPassword(password)
        const u = User.findOne('username', username)
        return u !== null && u.password === password
    }

    static register(form={}) {
        const { username, password } = form
        const validForm = username.length > 2 && password.length > 2
        const uniqueUser = User.findOne('username', username) === null
        if (validForm && uniqueUser) {
            const u = this.create(form)
            u.save()
            return u
        } else {
            return null
        }
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
