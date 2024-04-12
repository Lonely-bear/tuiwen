const mm = require('music-metadata');

async function getDuration(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    return metadata.format.duration * 1000000;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getDuration;