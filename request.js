const { log } = require('./utils')

class Request {
    // 构造器函数
    constructor(raw) {
        const { method, path, query, headers, body } = this._parsedRaw(raw)
        this.raw = raw
        this.method = method
        this.path = path
        this.query = query
        this.body = body
        this.headers = {}
        this.cookies = {}
        this.addHeaders(headers)
    }

    addCookies() {
        const cookies = this.headers.Cookie || ''
        const pairs = cookies.split('; ')
        pairs.forEach(pair => {
            if (pair.includes('=')) {
                const [k, v] = pair.split('=')
                this.cookies[k] = v
            }
        })
    }

    addHeaders(headers) {
        headers.forEach(header => {
            const [k, v] = header.split(': ')
            this.headers[k] = v
        })
        this.addCookies()
    }

    // 一般使用 post 方法提交的数据会放在 request body 中
    // 使用 get 方法提交的数据会放在 path 中
    // 封装一个 form 方法, 直接获取解析之后的数据(以 object 的形式)
    form() {
        // 浏览器在发送 form 表单的数据时, 会自动使用 encodeURIComponent 编码
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        for (let pair of pairs) {
            const [k, v] = pair.split('=')
            d[k] = v
        }
        return d
    }

    // 解析 path
    static _parsedPath (path) {
        const index = path.indexOf('?')
        if (index === -1) {
            return {
                path: path,
                query: {}
            }
        } else {
            const l = path.split('?')
            path = l[0]

            const search = l[1]
            const args = search.split('&')
            const query = {}
            for (let arg of args) {
                const [k, v] = arg.split('=')
                query[k] = v
            }
            return {
                path: path,
                query: query
            }
        }
    }

    // 解析请求原始信息
    static _parsedRaw (raw) {
    // const r = raw
    const [method, url, ..._] = raw.split(' ')
    const { path, query } = this._parsedPath(url)
    const message = raw.split('\r\n\r\n')
    const headers = message[0].split('\r\n').slice(1)
    const body = message[1]

    return {
        method,
        path,
        query,
        headers,
        body
    }
}

    // toString() {
    //     const s = JSON.stringify(this, null, 2)
    //     return s
    // }
}

module.exports = Request