const express = require('express');
const path = require('path');
const opn = require('opn');
const app = express();
const port = 3003;

app.use(express.static(path.resolve(__dirname, 'dist'))); // 这里的 'dist' 是你的静态文件（例如，Vue 打包后的文件）所在的目录

app.listen(port, async () => {
  console.log(`App listening at http://localhost:${port}`);
  await opn(`http://localhost:${port}`);
});