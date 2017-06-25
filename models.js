const fs = require('fs')
const log = require('./utils')

const ensureExists = path => {
    if (!fs.existsSync(path) {
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

    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }

}
