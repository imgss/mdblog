
---
title: canvas+gif.js打造自己的数字雨头像
tags: canvas
date: 2017-10-24 22:50:30
---
## 前言

今天是1024程序员节，不知道各位看官过的怎么样,节日快乐啊。既然是过节，就要有个过节的样子，比方说，换个头像😀，嗯，大家看我的头像~~牛逼不~~，这就是今天的主题了--一个数字雨动图生成的页面，上传一个静态头像，就能得到一个动态的数字雨头像。请看demo[传送门](https://imgss.github.io/demo/gif/)

### 使用说明

1. 传一个你喜欢的头像，最后是正方形的

2. 生成后看字符颜色是不是太诡异，可以改变字符颜色

3. 觉得满意，右键另存为即可

### gif.js

今天的主角是gif.js,数字雨就留到下篇文章了，感兴趣的同学可以看一下[从canvas理解面向对象](http://www.cnblogs.com/imgss/p/7712103.html)

gif.js可以很方便的根据canvas动图得到gif:

```js
//代码来自官网

var gif = new GIF({
  workers: 2,
  quality: 10
});//创建一个GIF实例

// 核心方法，向gif中加一帧图像，参数可以是img/canvas元素，还可以从ctx中复制一帧
gif.addFrame(imageElement);

// or a canvas element
gif.addFrame(canvasElement, {delay: 200});//一帧时长是200

// or copy the pixels from a canvas context
gif.addFrame(ctx, {copy: true});

gif.on('finished', function(blob) {//最后生成一个blob对象
  window.open(URL.createObjectURL(blob));
});

gif.render();//开始启动
```
整体而言，这个库的api十分简洁，由于生成gif图像是个耗费cpu的操作，尤其是当图像比较大的时候，因此库允许在webworker中渲染。但是文档中还是有几个要注意的地方要说明（其实是我踩的坑）:

1. git.addFrame是添加一帧，要生成会动的gif,要来一个循环：
```js
for(...){
    gif.render(...)
}
```

2. 构造函数GIF的选项中,需要workerScript选项,这样才能实现在worker中渲染图像，如下所示：
```js
    var gif = new GIF({
    workers: 2,
    quality: 10,
        workerScript:'./gif.worker.js'
    });
```

源码我放在github上了，[https://github.com/imgss/gif_rain_code](https://github.com/imgss/gif_rain_code)喜欢的话，请给我一个star,那我就要开心死了.

