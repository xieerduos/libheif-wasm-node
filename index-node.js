const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const convert = require("heic-convert");

main();

async function main() {
  const inputBuffer = await promisify(fs.readFile)("example2.heic");

  console.time("使用heic-convert耗时");
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: "JPEG", // output format
    quality: 1, // the jpeg compression quality, between 0 and 1
  });

  console.timeEnd("使用heic-convert耗时");

  const outputPath = path.join(__dirname, "result.jpg");

  fs.writeFileSync(outputPath, outputBuffer);

  console.log("转换后的图片已经保存到: ", outputPath);
}
