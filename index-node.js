const { promisify } = require("util");
const fs = require("fs");
const convert = require("heic-convert");

(async () => {
  const inputBuffer = await promisify(fs.readFile)("example2.heic");
  console.time("使用heic-convert耗时");
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: "JPEG", // output format
    quality: 1, // the jpeg compression quality, between 0 and 1
  });

  console.timeEnd("使用heic-convert耗时");

  await promisify(fs.writeFile)("./result.jpg", outputBuffer);
})();
