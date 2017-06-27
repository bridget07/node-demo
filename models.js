const fs = require('fs')
const log = require('./utils')

const ensureExists = path => {
    if (!fs.existsSync(path)){
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

// 把数据写入 path 文件中
const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

// 读取 path 文件中的数据
const load = path => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

// 定义一个 Model 类，基类，可以被其他类继承
class Model {
    // 返回一个 db 文件的路径（数据文件的文件名）
    static dbPath() {
        // 这是一个字符串形式的类名
        const classname = this.name.toLowerCase()
        const path = `${classname}.txt`
        return path
    }

    // 获取一个类 的所有实例
    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map(item => {
            const cls = this
            const instance = cls.create(item)
            return instance
        })
        return ms
    }

    // *************************8
    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }

    // save() {
    //     // 实例方法中的 this 指向的是实例本身, 也就是 new 出来的那个对象
    //     // this.constructor 是指类
    //     const cls = this.constructor
    //     const models = cls.all()
    //     models.push(this)
    //     const path = cls.dbPath()
    //     save(models, path)
    // }

    // 根据username 查找一个实例
    static findOne(key, value) {
        const all = this.all()
        let model = null
        all.forEach(m => {
            if (m[key] === value) {
                model = m
                // foreach 不支持break
                return false
            }
        })
        return model
    }

    // 根据username 查找所有实例
    static find(key, value) {
        const all = this.all()
        let models = []
        all.forEach(m => {
            if (m[key] === value) {
                models.push(m)
            }
        })
        return models
    }

    // 保存时加上id 信息
    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            // 这条数据原本没有ID信息
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                this.id = 0
            }
            models.push(this)
        } else {
            // 这条数据原本有ID信息，则替换掉相同id 的之前内容
            let index = -1
            models.forEach((m, i) => {
                if (m.id === this.id) {
                    index = i
                    return false
                }
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
        this.id = form.id
    }

    validateLogin() {
        // log(this, this.username, this.password)
        const u = User.findOne('username', this.username)
        return u !== null && u.password === this.password
    }

    validateRegister() {
        return this.username.length > 2 && this.password.length > 2
    }
}

class Message extends Model {
    constructor(form={}) {
        super()
        this.author = form.author || ''
        this.content = form.content || ''
        this.extra = 'extra message'
    }
}


module.exports = {
    User: User,
    Message: Message
}