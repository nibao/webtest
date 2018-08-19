const mysql = require('mysql')
const {
    db
} = require('../config.json')

class Cleardb {
    constructor(host = db.host, port = db.port, user = db.user, password = db.password) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
    }

    connect(database) {
        return mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: database
        })
    }
}

exports = module.exports = {
    Cleardb
}