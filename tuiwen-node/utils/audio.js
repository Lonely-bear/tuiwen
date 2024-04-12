const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const Core = require("@alicloud/pop-core");

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function getAudio(content, dir, CONFIG) {
  try {
    if (!content) return;
    const emotion = CONFIG.aliyun_emotion || "story";
    let fragment = content;
    fragment =
      '<speak><emotion category="' +
      emotion +
      '" intensity="1.0">' +
      fragment +
      "</emotion></speak>";
    const text = encodeURIComponent(fragment);
    const token = await getToken(CONFIG); // 你需要实现这个函数
    const appkey = CONFIG.aliyun_appkey || '';
    const format = "mp3";
    const voice = CONFIG.aliyun_voice || "zhimiao_emo";
    const speech_rate = CONFIG.aliyun_speech_rate || 80;
    const pitch_rate = 0;
    const url = `https://nls-gateway-cn-shanghai.aliyuncs.com/stream/v1/tts?appkey=${appkey}&token=${token}&text=${text}&format=${format}&sample_rate=16000&voice=${voice}&speech_rate=${speech_rate}&pitch_rate=${pitch_rate}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000,
    });
    const audioData = response.data;
    dir = "../public/audio/" + dir;
    const filename = Date.now() + ".mp3";
    const fileExist = await fileExists(path.join(__dirname, dir));
    if (!fileExist) {
      await fs.mkdir(path.join(__dirname, dir), { recursive: true });
    }
    await fs.writeFile(
      path.join(path.join(__dirname, dir), filename),
      audioData,
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    return path.join(dir, filename);
  } catch (error) {
    console.error(error);
  }
}

async function getToken(CONFIG) {
  const client = new Core({
    accessKeyId: CONFIG.aliyun_accessKeyId || "",
    accessKeySecret: CONFIG.aliyun_accessKeySecret || "",
    endpoint: "https://nls-meta.cn-shanghai.aliyuncs.com",
    apiVersion: "2019-02-28",
  });

  try {
    const response = await client.request("CreateToken");
    const token = response.Token;
    if (token != null) {
      return token.Id;
    } else {
      console.error("Failed to get token");
      process.exit(1);
    }
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = getAudio;
