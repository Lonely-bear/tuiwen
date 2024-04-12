const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function processImage(data, dir, CONFIG) {
  try {
    let stable_diffusion_url = CONFIG.stable_diffusion_url || "http://127.0.0.1:7860"
    let response = await axios.post(
      stable_diffusion_url + "/sdapi/v1/txt2img",
      data
    );
    let images = response.data.images;
    for (let i = 0; i < images.length; i++) {
      let base64Data = images[i].replace(/^data:image\/\w+;base64,/, "");
      let dataBuffer = Buffer.from(base64Data, "base64");
      dir = "../public/images/" + dir;
      const filename = Date.now() + ".png";
      if (!fs.existsSync(path.join(__dirname, dir))) {
        fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
      }
      await fs.writeFile(
        path.join(path.join(__dirname, dir), filename),
        dataBuffer,
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      return path.join(dir, filename);
    }
  } catch (error) {
    console.error(error);
  }
}

async function processAllImages(data, dir) {
  for (let i = 0; i < data.length; i++) {
    await processImage(data[i], dir);
  }
}
// {
//   "prompt": prompt,
//     "width": 800,
//       "height": 450,
//         "n_iter": 1,
//     }
module.exports = {
  processAllImages,
  processImage,
};
