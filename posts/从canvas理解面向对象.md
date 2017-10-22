---
title: 从canvas理解面向对象.md
tags: canvas
date: 2017-10-22 18:24:36
---

### 前言

据说在编程语言的发展过程中，面向对象语言的出现是为了解决GUI编程的问题而出现的。计算机一开始是用纸带，命令行等来和人进行交互，而图形界面的出现是一次重大的改进，使普通人很容易就能使用计算机。

我们知道，显示器通常是以60Hz频率刷新的。在显示的眼中，没有什么按钮，窗口，输入框这些组件的概念，你只需要告诉它在哪个时间，渲染什么样的画面，而按钮，窗口通通都是这一帧的一部分。尽管这符合浏览器的习惯，但是这不符合人们的思维习惯。在我们眼里，按钮就是一个物体，它有宽度，高度，还有位置颜色。随着界面的复杂，这种思维上的差异会表现的越来越明显。canvas和GUI编程很像，提供的接口也是一次一次在是刷新。下面利用canvas举几个场景来说明这种差异。

### 场景

1. 画一个正方形:[demo](https://codepen.io/imgss/pen/QqPagX)
```js
let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(10,10,20,20);
```
2. 让这个正方形动起来，按显示器的思维，就是擦掉上次的画面，然后在另一个地方重新画一次:[codepen链接](https://codepen.io/imgss/pen/YrMYLL)
```js
let x = 0,y = 0,speed={x:1,y:1};
function draw(){
    ctx.clearRect(0,0,400,400);
    ctx.fillRect(x,y,20,20);
    x+=speed.x;
    y+=speed.y;
    if(x>400 || x<0){
        speed.x = -speed.x;
        speed.y = -speed.y;
    }
}
```
3. 正方形在移动的时候还会不断缩放

这时你可能会再增加一个长度变量，然后在每一帧的绘制中，改变这个长度变量，来实现这个效果:[demo](https://codepen.io/imgss/pen/XeQZpV)
```js
let x = 0,y = 0,len = 10;speed={x:1,y:1,scale:1};
function draw(){
    ctx.clearRect(0,0,400,400);
    ctx.fillRect(x,y,len,len);
    x+=speed.x;
    y+=speed.y;
    len += speed.scale;
    if(x>400 || x<0){
        speed.x = -speed.x;
    }
    if(y>400 || y<0){
        speed.y = -speed.y;
    }
    if(len>20 || len<10){
        speed.scale = -speed.scale;
    }
}
```
我们将方块的位置，大小，颜色这些称为方块的状态。通过三个例子可以发现，随着方块的状态越来越多，比方说可以发射子弹。或者除了方块之外，还有草花，红桃也在来回移动，程序会变得越来越难于管理。这时候就需要面向对象了。

### 面向对象的思考方式

按照我们的思考方式，上面的场景就是一个方块的位置和大小在发生变化，所以有以下代码:
```js
function Block(x, y, len, color,speed){
    this.x = x || 0;
    this.y = y || 0;
    this.len = len || 10;
    this.color = color || 'red';
    this.speed = speed ||{
        x:1,y:1,scale:1
    }
}
let redBlock = new Block(0,0,10,'red');
```
这样，就把一个方块相关的属性放到一个对象里，而不像上面的一堆变量，毫无结构。同时，还能很方便的new 出大小，位置，颜色各不相同的方块。

另一个要注意的地方是speed这个属性，一开始写的时候，我计划是将speed作为函数move的参数，但是这样是不行的，原因是，函数move不会保留方块的移动状态，因此要作为方块的属性存放。

下面我们让方块动起来，我们把方块会动当成是方块的一个行为的话，就有下面的代码:
```js
Block.prototype.move = function(speed){
    this.speed = speed || {
        x:1,y:1,scale:1
    }
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.len += this.speed.scale;
    if(this.x>400 || this.x<0){
        this.speed.x = -this.speed.x;
    }
    if(this.y>400 || this.y<0){
        this.speed.y = -this.speed.y;
    }
    if(this.len>20 || this.len<10){
        this.speed.scale = -this.speed.scale;
    }
}

```
于是我们就有了一个会动的方块，最后一步是渲染，不妨把这个行为作为Block这个类的一个静态方法：
```js
Block.render = function(block){
  let cvs = document.querySelector('canvas');
  let ctx = cvs.getContext('2d');
  setInterval(function(){
    ctx.clearRect(0,0,400,400);
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x,block.y,block.len,block.len);
    block.move();
  },100)
}
```
渲染多个方块也容易:
```js
Block.renderMany = function(blocks){
  let cvs = document.querySelector('canvas');
  let ctx = cvs.getContext('2d');
  setInterval(function(){
    ctx.clearRect(0,0,400,400);
    for(let block of blocks){
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x,block.y,block.len,block.len);
        block.move();
    }
  },100)
}
```
渲染方块:[demo](https://codepen.io/imgss/pen/EwJQzG)
```js
let redBlock = new Block(0,0,10,'red');
let blueBlock = new Block(200,200,20,'blue',{x:-1,y:1,scale:2})
// Block.render(redBlock);
Block.renderMany([redBlock,blueBlock])
```
到这里，我理解的面向对象就算告一段落了，如果有不对的地方，希望各位看官指出。到这里也就算是基础，回到开始那个问题，如果有红桃，草花也在里面运动呢，那就要用到继承了。

