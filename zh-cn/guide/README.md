### 动画 Animate

在前面的例子里我们已经看过很多动画的用法。事实上，spritejs支持[Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)，因此可以让精灵使用.animate方法做出各种复杂的组合动画。

<div id="animations" class="sprite-container"></div>

我们既可以使用spritejs提供的animate动画，也可以使用其他方式，比如原生的setInterval或requestAnimationFrame。此外一些动画库提供的Tween动画，也可以很容易地结合spritejs使用。

```js
const birdsJsonUrl = 'https://s5.ssl.qhres.com/static/5f6911b7b91c88da.json'
const birdsRes = 'https://p.ssl.qhimg.com/d/inn/c886d09f/birds.png'

const scene = new Scene('#animations', {resolution: [1540, 600]})
const layer = scene.layer('fglayer')

const d = "M480,437l-29-26.4c-103-93.4-171-155-171-230.6c0-61.6,48.4-110,110-110c34.8,0,68.2,16.2,90,41.8C501.8,86.2,535.2,70,570,70c61.6,0,110,48.4,110,110c0,75.6-68,137.2-171,230.8L480,437z"
scene.preload([birdsRes, birdsJsonUrl]).then(function() {
  const path = new Path()

  path.attr({
    anchor: [0.5, 0.5],
    pos: [770, 300],
    path: {d, trim: true},
    lineWidth: 26,
    lineCap: 'round',
    gradients: {
      strokeColor: {
        vector: [0, 400, 400, 0],
        colors: [{
          offset: 0,
          color: 'rgba(255,0,0,1)',
        }, {
          offset: .5,
          color: 'rgba(255,0,0,0)',
        }, {
          offset: 1,
          color: 'rgba(255,0,0,0)',
        }]
      },
      fillColor: {
        vector: [0, 0, 400, 400],
        colors: [{
          offset: 0,
          color: 'rgba(255,0,0,0.7)',
        }, {
          offset: 1,
          color: 'rgba(255,255,0,0.7)',
        }]
      }
    }
  })

  layer.append(path)

  const s = new Sprite('bird1.png')
  const pathOffset = path.pathOffset,
    pathSize = path.innerSize

  s.attr({
    anchor: [0.5, 0.5],
    pos: [770 + pathOffset[0] - pathSize[0] / 2, 300 + pathOffset[1] - pathSize[1] / 2],
    size: [80, 50],
    offsetPath: path.svg.d,
    zIndex: 200,
  })
  s.animate([
    { offsetDistance: 0 },
    { offsetDistance: 1 }
  ], {
    duration: 6000,
    iterations: Infinity,
  })

  let i = 0
  setInterval(() => {
    s.textures = [`bird${i++%3 + 1}.png`]
  }, 100)

  const startTime = Date.now()
  const T = 6000
  requestAnimationFrame(function next(){
    const p = Math.PI * 2 * (Date.now() - startTime) / T
    const colors = [
      { offset: 0, color: 'rgba(255,0,0,1)' },
      { offset: 0.5 + 0.5 * Math.abs(Math.sin(p)), color: 'rgba(255,0,0,0)' },
      { offset: 1, color: 'rgba(255,0,0,0)' },
    ]

    const gradients = path.attr('gradients')
    gradients.strokeColor.colors = colors
    path.attr({gradients})

    requestAnimationFrame(next)     
  })

  layer.appendChild(s)
})
```

比起使用原生timer或者第三方库，直接使用spritejs提供的animate动画有一个额外的好处，就是它默认基于layer的timeline。也就是说我们可以通过控制layer的timeline来控制动画播放的速度，方便地加速、减速、暂停甚至回放动画。

<div>
<button id="speedUp">加速</button>
<button id="slowDown">减速</button>
<button id="pause">暂停</button>
<button id="resume">继续</button>
<span id="playbackRate">playbackRate: 1.0</span>
</div>

<div id="animations-playback" class="sprite-container" style="margin-top: 10px"></div>

通过控制playbackRate可以控制layer上的所有动画的播放速度，该属性也会影响到layer的draw方法中的时间参数，对自定义绘图中依赖于时间轴的也可以产生影响。

```js
const birdsJsonUrl = 'https://s5.ssl.qhres.com/static/5f6911b7b91c88da.json'
const birdsRes = 'https://p.ssl.qhimg.com/d/inn/c886d09f/birds.png'

const scene = new Scene('#animations-playback', {resolution: [1540, 600]})
const layer = scene.layer('fglayer')
const timeline = layer.timeline

function updateSpeed() {
  playbackRate.innerHTML = `playbackRate: ${timeline.playbackRate.toFixed(1)}`
}
speedUp.addEventListener('click', function(){
  timeline.playbackRate += 0.5
  updateSpeed()
})
slowDown.addEventListener('click', function(){
  timeline.playbackRate -= 0.5
  updateSpeed()
})
pause.addEventListener('click', function(){
  timeline.playbackRate = 0
  updateSpeed()
})
resume.addEventListener('click', function(){
  timeline.playbackRate = 1.0
  updateSpeed()
})

scene.preload([birdsRes, birdsJsonUrl]).then(function(){
  for(let i = 0; i < 10; i++) {
    if(i === 5 || i === 9) continue
    const bird = new Sprite('bird1.png')
    bird.attr({
      anchor: [0.5, 0.5],
      pos: [-50, 100 + (i % 5) * 100],
    })
    layer.append(bird)

    bird.animate([
      {textures: 'bird1.png'},
      {textures: 'bird2.png'},
      {textures: 'bird3.png'},
      {textures: 'bird1.png'},
    ], {
      duration: 500,
      iterations: Infinity,
      easing: 'step-end',
    })

    const delay = i < 5 ? Math.abs(2 - i) * 300 : (4 - Math.abs(7 - i)) * 300
    bird.animate([
      {x: -50},
      {x: 1600},
      {x: -50},
    ], {
      delay,
      duration: 6000,
      iterations: Infinity,    
    })

    bird.animate([
      {scale: [1, 1]},
      {scale: [-1, 1]},
      {scale: [1, 1]},
    ], {
      delay,
      duration: 6000,
      iterations: Infinity,
      easing: 'step-end',        
    })
  }
})

autoResize(scene)
```

layer的timeline是TimeLine类的一个对象，TimeLine类定义于[sprite-timeline](https://github.com/spritejs/sprite-timeline)，这是一个独立的库，也可以单独作于其他方式的动画。

spritejs动画功能非常丰富，关于动画的其他内容，可参考[高级用法：动画](/zh-cn/guide/animations)。

### 滤镜 filter

spritejs支持canvas滤镜，

### 渐变 gradient

### 事件 event


<!-- javascript -->
<script>
const {Scene, Layer, Sprite, Label, Path, Group} = spritejs

;(function(){
  const birdsJsonUrl = 'https://s5.ssl.qhres.com/static/5f6911b7b91c88da.json'
  const birdsRes = 'https://p.ssl.qhimg.com/d/inn/c886d09f/birds.png'

  const scene = new Scene('#animations', {resolution: [1540, 600]})
  const layer = scene.layer('fglayer')

  const d = "M480,437l-29-26.4c-103-93.4-171-155-171-230.6c0-61.6,48.4-110,110-110c34.8,0,68.2,16.2,90,41.8C501.8,86.2,535.2,70,570,70c61.6,0,110,48.4,110,110c0,75.6-68,137.2-171,230.8L480,437z"
  scene.preload([birdsRes, birdsJsonUrl]).then(function() {
    const path = new Path()

    path.attr({
      anchor: [0.5, 0.5],
      pos: [770, 300],
      path: {d, trim: true},
      lineWidth: 26,
      lineCap: 'round',
      gradients: {
        strokeColor: {
          vector: [0, 400, 400, 0],
          colors: [{
            offset: 0,
            color: 'rgba(255,0,0,1)',
          }, {
            offset: .5,
            color: 'rgba(255,0,0,0)',
          }, {
            offset: 1,
            color: 'rgba(255,0,0,0)',
          }]
        },
        fillColor: {
          vector: [0, 0, 400, 400],
          colors: [{
            offset: 0,
            color: 'rgba(255,0,0,0.7)',
          }, {
            offset: 1,
            color: 'rgba(255,255,0,0.7)',
          }]
        }
      }
    })

    layer.append(path)

    const s = new Sprite('bird1.png')
    const pathOffset = path.pathOffset,
      pathSize = path.innerSize

    s.attr({
      anchor: [0.5, 0.5],
      pos: [770 + pathOffset[0] - pathSize[0] / 2, 300 + pathOffset[1] - pathSize[1] / 2],
      size: [80, 50],
      offsetPath: path.svg.d,
      zIndex: 200,
    })
    s.animate([
      { offsetDistance: 0 },
      { offsetDistance: 1 }
    ], {
      duration: 6000,
      iterations: Infinity,
    })

    let i = 0
    setInterval(() => {
      s.textures = [`bird${i++%3 + 1}.png`]
    }, 100)

    const startTime = Date.now()
    const T = 6000
    requestAnimationFrame(function next(){
      const p = Math.PI * 2 * (Date.now() - startTime) / T
      const colors = [
        { offset: 0, color: 'rgba(255,0,0,1)' },
        { offset: 0.5 + 0.5 * Math.abs(Math.sin(p)), color: 'rgba(255,0,0,0)' },
        { offset: 1, color: 'rgba(255,0,0,0)' },
      ]

      const gradients = path.attr('gradients')
      gradients.strokeColor.colors = colors
      path.attr({gradients})

      requestAnimationFrame(next)     
    })

    layer.appendChild(s)
  })

  autoResize(scene)
}())

;(function(){
  const birdsJsonUrl = 'https://s5.ssl.qhres.com/static/5f6911b7b91c88da.json'
  const birdsRes = 'https://p.ssl.qhimg.com/d/inn/c886d09f/birds.png'
  
  const scene = new Scene('#animations-playback', {resolution: [1540, 600]})
  const layer = scene.layer('fglayer')
  const timeline = layer.timeline

  function updateSpeed() {
    playbackRate.innerHTML = `playbackRate: ${timeline.playbackRate.toFixed(1)}`
  }
  speedUp.addEventListener('click', function(){
    timeline.playbackRate += 0.5
    updateSpeed()
  })
  slowDown.addEventListener('click', function(){
    timeline.playbackRate -= 0.5
    updateSpeed()
  })
  pause.addEventListener('click', function(){
    timeline.playbackRate = 0
    updateSpeed()
  })
  resume.addEventListener('click', function(){
    timeline.playbackRate = 1.0
    updateSpeed()
  })

  scene.preload([birdsRes, birdsJsonUrl]).then(function(){
    for(let i = 0; i < 10; i++) {
      if(i === 5 || i === 9) continue
      const bird = new Sprite('bird1.png')
      bird.attr({
        anchor: [0.5, 0.5],
        pos: [-50, 100 + (i % 5) * 100],
      })
      layer.append(bird)

      bird.animate([
        {textures: 'bird1.png'},
        {textures: 'bird2.png'},
        {textures: 'bird3.png'},
        {textures: 'bird1.png'},
      ], {
        duration: 500,
        iterations: Infinity,
        easing: 'step-end',
      })

      const delay = i < 5 ? Math.abs(2 - i) * 300 : (4 - Math.abs(7 - i)) * 300
      bird.animate([
        {x: -50},
        {x: 1600},
        {x: -50},
      ], {
        delay,
        duration: 6000,
        // direction: 'alternate',
        iterations: Infinity,    
      })

      bird.animate([
        {scale: [1, 1]},
        {scale: [-1, 1]},
        {scale: [1, 1]},
      ], {
        delay,
        duration: 6000,
        iterations: Infinity,
        easing: 'step-end',        
      })
    }
  })

  autoResize(scene)
}())
</script>
