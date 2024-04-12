const db_config = {
  // 主机地址，不知道的就默认不用改
  host: 'localhost',
  // 数据库用户名，默认是root
  user: 'root',
  // 数据库密码，默认是root
  password: this.options?.password || 'root',
  // 数据库名，默认是tk
  database: this.options?.database || 'tk'
}

// ❗❗❗尽量别改下面的配置，除非你知道你在干什么
// 注意，如果此处修改了，请同时修改前端代码中的端口
const ws_config = {
  // websocket服务端口，默认是3001
  port: 3001,
}

const api_config = {
  // api服务端口，默认是3000
  port: 3000,
}

module.exports = {
  db_config,
  ws_config,
  api_config
}