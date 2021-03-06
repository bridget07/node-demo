const fs = require('fs')
const { log } = require('../utils')

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

class Model {
    static dbPath() {
        // 这是一个字符串形式的类名
        const classname = this.name.toLowerCase()
        //***************
        const path = require('path')
        const filename = `${classname}.txt`
        // 使用绝对路径保证路径
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    //************************
    static _newFromDict(dict) {
        const cls = this
        const m = new this(dict)
        return m
    }

    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map(item => {
            const cls = this
            const instance = cls._newFromDict(item)
            return instance
        })
        return ms
    }

    // *************************8
    static create(form={}) {
        const instance = new this(form)
        instance.save()
        return instance
    }

    // 根据username 查找一个实例
    static findOne(key, value) {
        const all = this.all()
        let m = all.find(e => {
            return e[key] === value
        })
        if (m === undefined) {
            m = null
        }
        return m
    }

    static find(key, value) {
        const all = this.all()
        const models = all.filter(m => {
            return m[key] === value
        })
        return models
    }

    static get(id) {
        // id = parseInt(id, 10)
        // log('')
        return this.findOne('id', id)
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
                this.id = 1
            }
            models.push(this)
        } else {
            // 这条数据原本有ID信息，则替换掉相同id 的之前内容
            const index = models.findIndex(e => {
                return e.id === this.id
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }

    static remove(id) {
        const models = this.all()
        const index = models.findIndex(e => {
            return e.id === id
        })
        if (index > -1) {
            models.splice(index, 1)
        }
        const path = this.dbPath()
        save(models, path)
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

module.exports = Model