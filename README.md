# libheif wasm 在 node.js 中运行

## 快速开始

```bash
npm install
```

```bash
node index-wasm.js
```

## 创建 index-wasm.js 文件

在当前目录下要有 libheif.js 、libheif.wasm 文件

```js
const libheif = require("./libheif");
const fs = require("fs");
const jpeg = require("jpeg-js");

main();

async function main() {
  await libheif.whenReady;

  console.time("使用WebAssembly耗时");

  const buffer = fs.readFileSync("./example2.heic");

  const decoder = new libheif.HeifDecoder();

  const [image] = decoder.decode(buffer);

  const width = image.get_width(); // 图片的宽高
  const height = image.get_height(); // 图片的宽高

  const imageUint8Array = await new Promise((resolve, reject) => {
    const img = libheif.heif_js_decode_image2(
      image.handle,
      libheif.heif_colorspace_RGB,
      libheif.heif_chroma_interleaved_RGBA
    );

    for (let c of img.channels) {
      if (c.id == libheif.heif_channel_interleaved) {
        resolve(c.data);
        return;
      }
    }

    reject();
  });

  console.timeEnd("使用WebAssembly耗时");

  saveUint8ArrayAsJPEG(imageUint8Array, width, height, "wasm-result.jpg", 100);

  // saveUint8ArrayAsBMP(imageUint8Array, width, height, "result.bmp");
}

function saveUint8ArrayAsBMP(imageUint8Array, width, height, outputPath) {
  // 计算BMP文件的大小
  const fileSize = 54 + width * height * 3; // 54字节是BMP文件头的大小，每个像素3个字节（红、绿、蓝）

  // 创建一个Buffer来存储BMP文件数据
  const bmpBuffer = Buffer.alloc(fileSize);

  // 写入BMP文件头
  bmpBuffer.write("BM", 0); // 文件类型标识
  bmpBuffer.writeInt32LE(fileSize, 2); // 文件大小
  bmpBuffer.writeInt32LE(0, 6); // 保留字段
  bmpBuffer.writeInt32LE(54, 10); // 从文件头到位图数据的偏移量
  bmpBuffer.writeInt32LE(40, 14); // 位图信息头的大小
  bmpBuffer.writeInt32LE(width, 18); // 图片宽度
  bmpBuffer.writeInt32LE(-height, 22); // 图片高度（注意此处为负数，表示颠倒排列）
  bmpBuffer.writeInt16LE(1, 26); // 颜色平面数（1）
  bmpBuffer.writeInt16LE(24, 28); // 每个像素的位数（24位色）
  bmpBuffer.writeInt32LE(0, 30); // 压缩类型（无压缩）
  bmpBuffer.writeInt32LE(width * height * 3, 34); // 图像数据大小

  // 将Uint8Array中的RGB数据复制到BMP文件中
  for (let i = 0; i < imageUint8Array.length; i += 4) {
    bmpBuffer.writeUInt8(imageUint8Array[i + 2], 54 + (i / 4) * 3); // 红色通道
    bmpBuffer.writeUInt8(imageUint8Array[i + 1], 54 + (i / 4) * 3 + 1); // 绿色通道
    bmpBuffer.writeUInt8(imageUint8Array[i], 54 + (i / 4) * 3 + 2); // 蓝色通道
  }

  // 使用fs模块将BMP数据写入文件
  fs.writeFileSync(outputPath, bmpBuffer);

  console.log("彩色图片已成功保存到:", outputPath);
}

function saveUint8ArrayAsJPEG(
  imageUint8Array,
  width,
  height,
  outputPath,
  quality = 100
) {
  // 创建一个JPEG数据对象
  const jpegData = {
    data: imageUint8Array,
    width: width,
    height: height,
  };

  // 使用jpeg-js库的方法将JPEG数据编码为JPEG格式数据
  const jpegImageData = jpeg.encode(jpegData, quality);

  // 使用fs模块将JPEG数据写入文件
  fs.writeFileSync(outputPath, jpegImageData.data);

  console.log("JPEG图片已成功保存到:", outputPath);
}
```

```bash
shaohai.li@192 libheif-node % node index-wasm.js
使用WebAssembly耗时: 92.167ms
JPEG图片已成功保存到: wasm-result.jpg
彩色图片已成功保存到: result.bmp
shaohai.li@192 libheif-node %
```
