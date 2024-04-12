//---------------------- 依赖包 ----------------------//
const os = require("os");
const DB = require("./utils/db.js");
const path = require("path");
const $audio = require("./utils/audio.js");
const $audioMeta = require("./utils/audioMeta.js");
const $prompt = require("./utils/prompt.js");
const { processImage: $txt2img } = require("./utils/txt2img.js");
const $draft = require("./utils/draft.js");
const { v4: uuid } = require("uuid");
const Segment = require("segment");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db_config } = require("./config.js");
//---------------------- 依赖包 ----------------------//

//---------------------- 全局变量 ----------------------//
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static("public"));
const segment = new Segment();
segment.useDefault();
const db = new DB(db_config);
const WS = require("ws");

let ws;
const sockets = {};
const CONFIG = {};
//---------------------- 全局变量 ----------------------//

//---------------------- 工具类 ----------------------//
console.send = (socket, message) => {
  socket.send(typeof message === "string" ? message : JSON.stringify(message));
  console.log(message);
};

function autoClosePC(socket) {
  const platform = os.platform();
  if (platform === "win32") {
    const exec = require("child_process").exec;
    exec("shutdown -s -t 60");
  }
  if (platform === "darwin") {
    const exec = require("child_process").exec;
    exec("shutdown -h +1");
  }
  if (platform === "linux") {
    const exec = require("child_process").exec;
    exec("shutdown -h +1");
  }
  console.send(socket, {
    refresh: 99,
    msg: "所有任务执行完成，电脑将在1分钟后自动关机",
  });
}

function cancelAutoClosePC(socket) {
  const platform = os.platform();
  if (platform === "win32") {
    const exec = require("child_process").exec;
    exec("shutdown -a");
  }
  if (platform === "darwin") {
    const exec = require("child_process").exec;
    exec("shutdown -c");
  }
  if (platform === "linux") {
    const exec = require("child_process").exec;
    exec("shutdown -c");
  }
  console.send(socket, { refresh: 0, msg: "已取消自动关机" });
}
//---------------------- 工具类 ----------------------//

//---------------------- 初始化 ----------------------//
(async function init() {
  const res = await db.query("SELECT * FROM setting");
  res.forEach((item) => {
    CONFIG[item.key] = item.value;
  });
  ws = new WS.Server({
    port: CONFIG.websocket_port || 3001,
  });
  app.listen(CONFIG.api_port || 3000);
  ws.on("connection", onWsConnection);
  console.log(
    "已启动websocket服务: ws://localhost:" + CONFIG.websocket_port || 3001
  );
  console.log("已启动API服务: http://localhost:" + CONFIG.api_port || 3000);
})();
//---------------------- 初始化 ----------------------//

//---------------------- API ----------------------//
// 项目列表
app.get("/projects/query", queryProjects);
// 项目详情
app.get("/project/query", queryProject);
// 项目删除
app.post("/project/delete", deleteProject);
// 删除指定配图
app.post("/detail/delete", deleteDetail);
// 系统配置
app.get("/setting/query", querySetting);
// 系统配置更新
app.post("/setting/update", updateSetting);

async function deleteProject(req, res) {
  const { project_id } = req.body;
  if (!project_id) {
    res.json({ code: 1, msg: "项目ID不能为空" });
    return;
  }
  const sql = "DELETE FROM project WHERE id = ?";
  const result = await db.query(sql, project_id);
  if (!result) {
    res.json({ code: 1, msg: "删除失败" });
    return;
  }
  res.json({ code: 0, msg: "删除成功" });
}

/**
 * 删除文本相关项
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function deleteDetail(req, res) {
  const { ids, type } = req.body;
  const sql = `UPDATE text SET ${type} = NULL WHERE id IN (?)`;
  const result = await db.query(sql, [ids]);
  if (!result) {
    res.json({ code: 1, msg: "删除失败" });
    return;
  }
  res.json({ code: 0, msg: "删除成功" });
}

/**
 * 项目列表
 * @param {*} req
 * @param {*} res
 */
async function queryProjects(req, res) {
  const name = req.query.name;
  let sql;
  let result;
  if (name) {
    sql = "SELECT * FROM project WHERE name LIKE ? ORDER BY id DESC";
    result = await db.query(sql, "%" + name + "%");
  } else {
    sql = "SELECT * FROM project ORDER BY id DESC";
    result = await db.query(sql);
  }
  const data = result.map((item) => ({
    ...item,
    draft: item.draft ? "http://localhost:3000/" + item.draft : null,
  }));
  res.json(data);
}

/**
 * 项目详情
 * @param {*} req
 * @param {*} res
 */
async function queryProject(req, res) {
  const project_id = req.query.project_id;
  const sql = "SELECT * FROM text WHERE project_id = ?";
  const result = await db.query(sql, project_id);
  const data = result.map((item) => ({
    ...item,
    split: item.split ? JSON.parse(item.split) : null,
    audio: item.audio ? "http://localhost:3000/" + item.audio : null,
    image: item.image ? "http://localhost:3000/" + item.image : null,
  }));
  res.json(data);
}

/**
 * 系统配置
 * @param {*} req
 * @param {*} res
 */
async function querySetting(req, res) {
  const result = await db.query("SELECT * FROM setting ORDER BY `key` ASC");
  const data = result.map((item) => item);
  res.json(data);
}

/**
 * 系统配置更新
 * @param {*} req
 * @param {*} res
 */
async function updateSetting(req, res) {
  const { key, value } = req.body;
  const result = await db.query(
    "UPDATE setting SET value = ? WHERE `key` = ?",
    [value, key]
  );
  if (!result) {
    res.json({ code: 1, msg: "更新失败" });
    return;
  }
  res.json({ code: 0, msg: "更新成功" });
}
//---------------------- API ----------------------//

//---------------------- 主函数 ----------------------//
async function onWsConnection(socket) {
  const userId = uuid().toUpperCase();
  sockets[userId] = socket;
  console.log("客户端" + userId + "已连接");
  socket.on("message", function (data) {
    data = data.toString("utf-8");
    data = JSON.parse(data);
    const type = data?.type || 0;
    console.log("接收到客户端消息", data);
    try {
      switch (type) {
        case 0:
          taskNormalHandler(socket, data);
          break;
        case 1:
          taskAddHandler(socket, data);
          break;
        case 2:
          taskTranslateHandler(socket, data);
          break;
        case 3:
          taskAudioHandler(socket, data);
          break;
        case 4:
          taskImgHandler(socket, data);
          break;
        case 5:
          taskDraftHandler(socket, data);
          break;
        case 99:
          taskAllHandler(socket, data);
          break;
        case 999:
          taskAllRepeatHandler(socket, data);
          break;
        case 998:
          cancelAutoClosePC(socket);
          break;
        default:
          taskNormalHandler(socket, data);
      }
    } catch (err) {
      console.send(socket, { refresh: -1, msg: err });
    }
  });
  socket.on("error", function (err) {
    console.log(err);
  });

  socket.on("close", function () {
    delete sockets[userId];
  });
}

/**
 * 批量执行全部任务
 * @param {*} socket
 * @param {*} data
 */
async function taskAllHandler(socket, data) {
  await taskTranslateHandler(socket, data);
  await taskAudioHandler(socket, data);
  await taskImgHandler(socket, data);
  await taskDraftHandler(socket, data);
}

/**
 * 批量执行全部项目
 * @param {*} socket
 * @param {*} data
 */
async function taskAllRepeatHandler(socket, data) {
  const tasks = data.data;
  const autoClose = data.autoClosePC;
  for (let i = 0; i < tasks.length; i++) {
    await taskAllHandler(socket, tasks[i]);
  }
  if (autoClose) autoClosePC(socket);
}

/**
 * 基础消息处理
 * @param {*} socket
 * @param {*} data
 */
async function taskNormalHandler(socket, data) {
  socket.send({ refresh: 0, msg: "服务端已收到消息" });
}

/**
 * 新建项目
 * @param {*} socket
 * @param {*} data
 */
async function taskAddHandler(socket, data) {
  db.query("INSERT INTO project SET ?", {
    name: data.data.name,
    textContent: data.data.textContent,
    createTime: new Date(),
    status: data.data.status || 0,
  }).then((result) => {
    console.send(socket, { refresh: 0, msg: "项目入库成功" });
    const project_id = result.insertId;
    const textArr = data.data.textContentSplit;
    const textArrMap = textArr.map((item) => {
      const split = [
        ...new Set(
          segment
            .doSegment(item, {
              stripPunctuation: true,
            })
            .map((item) => item.w)
        ),
      ];
      return [project_id, item, JSON.stringify(split)];
    });
    db.query("INSERT INTO text (project_id, content, split) VALUES ?", [
      textArrMap,
    ]).then(() => {
      console.send(socket, { refresh: 0, msg: "文案及分词存入数据库成功" });
    });
  });
}

/**
 * 生成提示词
 * @param {*} socket
 * @param {*} data
 */
async function taskTranslateHandler(socket, data) {
  const project_id = data.data.project_id;
  if (!project_id) {
    console.send(socket, { refresh: -1, msg: "项目ID不能为空" });
    return;
  }
  const gpt_prompt_prefix =
    CONFIG.gpt_prompt_prefix || "单词翻译为英语，逗号分割：";
  const res = await db.query(
    "SELECT id, split FROM text WHERE project_id = ? AND (prompt IS NULL OR prompt = '') AND split IS NOT NULL",
    project_id
  );
  const arr = res.map((item) => ({
    split: JSON.parse(item.split),
    id: item.id,
  }));
  if (!arr.length) {
    console.send(socket, { refresh: 0, msg: "提示词已全部生成" });
    return;
  }
  arr.forEach(async (item) => {
    try {
      const split = item.split;
      const id = item.id;
      const prompt = await $prompt(
        gpt_prompt_prefix + split.join(","),
        {},
        CONFIG
      );
      db.query("UPDATE text SET prompt = ? WHERE project_id = ? AND id = ?", [
        prompt,
        project_id,
        id,
      ]).then(() => {
        console.send(socket, { refresh: 1, msg: "prompt生成成功" });
      });
    } catch (error) {
      console.send(socket, { refresh: -1, msg: error });
    }
  });
}

/**
 * 生成音频
 * @param {*} socket
 * @param {*} data
 */
async function taskAudioHandler(socket, data) {
  try {
    const project_id = data.data.project_id;
    if (!project_id) {
      console.send(socket, { refresh: -1, msg: "项目ID不能为空" });
      return;
    }
    const project_name = (data.data.project_name || "未命名项目");
    const res = await db.query(
      "SELECT id, content FROM text WHERE project_id = ? AND (audio IS NULL OR audio = '') AND content IS NOT NULL",
      project_id
    );
    const arr = res.map((item) => ({ content: item.content, id: item.id }));
    if (!arr.length) {
      console.send(socket, { refresh: 0, msg: "配音已全部生成" });
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const content = item.content;
      const id = item.id;
      try {
        const audio = await $audio(
          content,
          project_id + "_" + project_name,
          CONFIG
        );
        const targetPath = path.join(
          __dirname,
          audio.replace("..\\public", "public").replace("../public", "public")
        );
        const audio_duration = await $audioMeta(targetPath);
        db.query(
          "UPDATE text SET audio = ?, audio_duration = ? WHERE project_id = ? AND id = ?",
          [audio, audio_duration, project_id, id]
        ).then(() => {
          console.send(socket, { refresh: 1, msg: "配音生成成功" });
        });
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.send(socket, { refresh: -1, msg: error });
  }
}

/**
 * 生成图片
 * @param {*} socket
 * @param {*} data
 */
async function taskImgHandler(socket, data) {
  const project_id = data.data.project_id;
  if (!project_id) {
    console.send(socket, { refresh: -1, msg: "项目ID不能为空" });
    return;
  }
  const project_name = (data.data.project_name || "未命名项目");
  const res = await db.query(
    "SELECT id, prompt FROM text WHERE project_id = ? AND (image IS NULL OR image = '') AND prompt IS NOT NULL",
    project_id
  );
  const arr = res.map((item) => ({ prompt: item.prompt, id: item.id }));
  if (!arr.length) {
    console.send(socket, { refresh: 0, msg: "配图已全部生成" });
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const prompt = item.prompt;
    const id = item.id;
    const params = {
      prompt: CONFIG.image_lora + prompt,
      // negative_prompt: CONFIG.image_negative_prompt + prompt,
      restore_faces: parseInt(CONFIG.image_restore_faces) || false,
      // sampler_name: CONFIG.image_sampler_name || "Euler a",
      width: parseInt(CONFIG.image_width) || 800,
      height: parseInt(CONFIG.image_height) || 450,
      steps: parseInt(CONFIG.image_steps) || 20,
      cfg_scale: parseInt(CONFIG.image_cfg_scale) || 7,
      // tiling: parseInt(CONFIG.image_tiling) || false,
      // enable_hr: parseInt(CONFIG.image_enable_hr) || false,
      // hr_upscaler: CONFIG.image_hr_upscaler || "Latent",
      hr_scale: parseInt(CONFIG.image_hr_scale) || 2,
    };
    if (CONFIG.image_model) {
      params.override_settings = {
        sd_model_checkpoint: CONFIG.image_model,
      };
    }
    const image = await $txt2img(
      params,
      project_id + "_" + project_name,
      CONFIG
    );
    db.query("UPDATE text SET image = ? WHERE project_id = ? AND id = ?", [
      image,
      project_id,
      id,
    ]).then(() => {
      console.send(socket, { refresh: 1, msg: "配图生成成功" });
    });
  }
}

async function taskDraftHandler(socket, data) {
  try {
    const project_id = data.data.project_id;
    if (!project_id) {
      console.send(socket, { refresh: -1, msg: "项目ID不能为空" });
      return;
    }
    const project_name = (data.data.project_name || "未命名项目");
    const res = await db.query(
      "SELECT * FROM text WHERE project_id = ?",
      project_id
    );
    const arr = res.map((item) => ({
      id: item.id,
      image: item.image
        ? path.join(
          __dirname + "/",
          item.image
            .replace("..\\public", "public")
            .replace("../public", "public")
        )
        : "",
      audio: item.audio
        ? path.join(
          __dirname + "/",
          item.audio
            .replace("..\\public", "public")
            .replace("../public", "public")
        )
        : "",
      audio_duration: parseInt(item.audio_duration),
    }));
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].image || !arr[i].audio) {
        console.send(socket, {
          refresh: -1,
          msg: "请检查是否有未完成的配图、配音",
        });
        return;
      }
    }
    const draft = await $draft(arr, project_id + "_" + project_name, CONFIG);
    db.query("UPDATE project SET draft = ? WHERE id = ?", [
      draft,
      project_id,
    ]).then(() => {
      console.send(socket, { refresh: 2, msg: "草稿生成成功" });
    });
  } catch (error) {
    console.send(socket, { refresh: -1, msg: error });
  }
}
