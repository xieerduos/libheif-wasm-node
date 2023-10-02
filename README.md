# libheif wasm 在 node.js 中运行

## 安装

```bash
npm install
```

## 运行

libheif wasm 比 heic-convert 更快

```bash
usename@192 libheif-node % node index-node.js
使用heic-convert耗时: 508.115ms
转换后的图片已经保存到:  /Users/usename/Desktop/libheif-node/result.jpg
```

```bash
usename@192 libheif-node % node index-wasm.js
使用WebAssembly耗时: 92.073ms
JPEG图片已成功保存到: /Users/usename/Desktop/libheif-node/wasm-result.jpg
usename@192 libheif-node %
```
