<style>
#demo-quickStart {
  width: 100%;
  padding-bottom: 26%;
}
</style>

## 简介

sprite.js 是跨平台的2D绘图对象模型库，它能够支持web、node、桌面应用和微信小程序的图形绘制和实现各种动画效果。

## 特性

- 像操作DOM对象一样操作画布上的图形元素
- 通过智能缓存大大提升渲染性能
- 支持多图层处理图形、文本、图像渲染
- 支持DOM事件代理、自定义事件派发
- 使用ES6+语法和面向对象编程
- 结构化对象树，对[d3](https://github.com/d3/d3)引擎友好，能够无缝使用
- 支持[服务端渲染](#server-side-render)
- 支持[微信小程序](https://github.com/spritejs/sprite-wxapp)

## 安装和使用

如果你使用NPM进行包管理，可以直接使用npm命令安装

```bash
npm install spritejs
```

如果你在浏览器中直接使用，可以使用CDN版本

```html
<script src="https://s5.ssl.qhres.com/!4b1f1e80/spritejs.min.js"></script>
```

如果你要在node服务端使用spritejs渲染，你需要安装[node-canvas](https://github.com/Automattic/node-canvas)

可能需要先安装一下依赖：

```bash
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
```

然后安装node-canvas 2.x：

```bash
npm install canvas@next
```

如果你在小程序中使用，你可以直接[下载](https://s5.ssl.qhres.com/!5cceaaaa/sprite-wxapp.js)打包好的小程序版本，或者从[项目源码](https://github.com/spritejs/sprite-core)编译。

## 架构

spritejs提供四类基础精灵元素、图层管理和负责协调多个图层的场景（Scene），类此外提供一些简单的辅助工具。

![架构图](/res/spritejs-design1.svg)

## 基本用法 
[JSBin](https://code.h5jun.com/sedam/edit?js,output)

```html
<div id="demo-quickStart"></div>
<script>
const {Scene, Sprite} = spritejs

const scene = new Scene('#demo-quickStart', {viewport: [770, 200], resolution: [3080, 800]})

const layer = scene.layer()

const robot = new Sprite('/res/robot.png')

robot.attr({
  anchor: [0, 0.5],
  pos: [0, 0],
})

robot.animate([
  {pos: [0, 0]},
  {pos: [0, 300]},
  {pos: [2700, 300]},
  {pos: [2700, 0]},
], {
  duration: 5000,
  iterations: Infinity,
  direction: 'alternate',
})

layer.append(robot)
</script>
```

<div id="demo-quickStart" style="position:relative"></div>

<script>
const {Scene, Sprite} = spritejs

const scene = new Scene('#demo-quickStart', {resolution: [3080, 800]})
const layer = scene.layer()

const robot = new Sprite('https://p5.ssl.qhimg.com/t01c33383c0e168c3c4.png')

robot.attr({
  anchor: [0, 0.5],
  pos: [0, 0],
})

robot.animate([
  {pos: [0, 0]},
  {pos: [0, 300]},
  {pos: [2700, 300]},
  {pos: [2700, 0]},
], {
  duration: 5000,
  iterations: Infinity,
  direction: 'alternate',
})

layer.append(robot)

autoResize(scene)
</script>
