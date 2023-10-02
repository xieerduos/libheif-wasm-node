# libheif wasm 在 node.js 中运行

## 安装

```bash
npm install
```

## 运行

libheif wasm 比 heic-convert 更快

```bash
shaohai.li@192 libheif-node % node index-wasm.js
使用WebAssembly耗时: 92.167ms
JPEG图片已成功保存到: wasm-result.jpg
彩色图片已成功保存到: result.bmp
shaohai.li@192 libheif-node %
```

```bash
shaohai.li@192 libheif-node % node index-node.js
使用heic-convert耗时: 509.953ms
shaohai.li@192 libheif-node %
```
