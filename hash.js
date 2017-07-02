const crypto = require('crypto')

const testMd5 = function (s) {
    let algorithm = 'md5'
    let hash = crypto.createHash(algorithm)
    hash.update(s)
    // return hash.digest('hex')
    console.log('md5 摘要', hash.digest('hex'))
}

const testSha1 = function (s) {
    let algorithm = 'sha1'
    let hash = crypto.createHash(algorithm)
    hash.update(s)
    console.log('sha1 摘要', hash.digest('hex'))
}

function saltedPassword(password, salt='') {
    function _md5hex(s) {
        let hash = crypto.createHash('md5')
        hash.update(s)
        let h = hash.digest('hex')
        return h
    }

    let hash1 = _md5hex(password)
    let hash2 = _md5hex(hash1 + salt)
    console.log('hashed password', hash1, hash2)
    return hash2
}

const testSalt = function () {
    saltedPassword('12345', '')
    saltedPassword('12345', 'abc')
}

var testRaw = function () {
    function hashedPassword(password) {
        var hash = crypto.createHash('md5')
        hash.update(password)
        var pwd = hash.digest('hex')
        return pwd
    }

    console.time('find password')
    const pwd = '81dc9bdb52d04dc20036dbd8313ed055'

    for (var i = 1000; i < 10000; i++) {
        var s = String(i)
        var password = hashedPassword(s)
        // var password = testMd5(s)
        if (password === pwd) {
            console.log('password', password)
            console.log('pwd', pwd)
            console.log('原始密码是', s)
            break
        }
    }
    console.timeEnd('find password')
}

var testEncrypt = function (s, key) {
    var algorithm = 'aes-256-cbc'
    var cipher = crypto.createCipher(algorithm, key)
    var c = cipher.update(s, 'utf8', 'hex')
    c += cipher.final('hex')
    console.log('加密后的信息', c)
    return c
}

var testDecrpto = function (c, key) {
    var algorithm = 'aes-256-cbc'
    var decipher = crypto.createDecipher(algorithm, key)
    var d = decipher.update(c, 'hex', 'utf8')
    d += decipher.final('utf8')
    console.log('原始信息', d)
}

var test = function () {
    var s = 'gua'
    // testMd5(s)
    // testSha1(s)
    // testSalt()

    var key = 'dududu'
    var c = testEncrypt(s, key)
    testDecrpto(c, key)

    // testRaw()

    var hashes = crypto.getHashes()
    var ciphers = crypto.getCiphers()

    // console.log('hashes method','\n', hashes, '\n', 'ciphers method', '\n', ciphers)
}

test()




