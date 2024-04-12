const mysql = require('mysql');

class DB {
  constructor(options) {
    this.options = options;
    this.start();
  }

  start() {
    this.db = mysql.createConnection({
      host: this.options?.host || 'localhost',
      user: this.options?.user || 'root',
      password: this.options?.password || 'root',
      database: this.options?.database || 'tk'
    });

    this.db.connect(err => {
      if (err) {
        console.log('数据库连接失败');
        throw err;
      }
      console.log('数据库连接成功');
    });

    this.db.on('error', err => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log("数据库自动重连...")
        this.start();
      } else {
        throw err;
      }
    });
  }

  query(sql, data) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, data, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  end() {
    this.db.end(err => {
      if (err) throw err;
      console.log('数据库关闭成功');
      process.exit();
    });
  }
}

module.exports = DB;