
---
title: 认真学习customEvent
tags: DOM
date: 2017-7-22 23:20:57
---
> 最近要实现一个模拟的select元素组件，所以好好看了这个自定义事件api，记录一下。

整体来说，这个api由3部分组成，监听事件的元素，触发事件的元素和event对象.

* 监听事件的元素主要负责监听事件，事件发生了调用回调函数。跟DOM事件一样
* 触发事件的元素负责在一定的条件下触发自定义事件
* `event`对象，就好像击鼓传花，由事件的触发者传递给事件的监听者，供回调函数使用

这里要注意的是，自定义事件依然符合捕获-目标-冒泡这三个阶段，也就是说，子元素触发的事件，子元素和他的祖先元素可以接收到，而子元素的兄弟元素就算注册了监听事件，等到花儿都谢了，也不会触发回调函数的。。。(我一开始就是这么干的)

下面就通过一个自定义的select事件来说明自定义元素的作用:html结构如下：

```html
  <div class='selector'>
    <div class='selected'>啥都没选</div>
    <div class = 'options'>
      <div >1</div>
      <div >2</div>
      <div >3</div>
      <div >4</div>
      <div >5</div>
    </div>
  </div>
```

在这个例子中，我们希望实现的效果是，点击选项时，会触发`select`事件，同时可以在根元素上监听到`select`这个自定义事件,js代码如下:

```js

  document.querySelector('.options').addEventListener('click', function (evt) {
    if (evt.target.classList.contains('options')) {
      return;
    }
    var text = evt.target.innerHTML;
    //构造自定义事件
    var select = new CustomEvent('select', {
      detail: event.target.innerHTML,
      bubbles: true//允许冒泡被祖先元素监听到
    });
    evt.target.dispatchEvent(select)//把select事件抛出去
  })
  document.querySelector('.selector').addEventListener('select', function (evt){ 
    this.querySelector('.selected').innerHTML = evt.detail;
  })


```
<p data-height="300" data-theme-id="27057" data-slug-hash="NvPjde" data-default-tab="js,result" data-user="imgss" data-embed-version="2" data-pen-title="NvPjde" class="codepen">See the Pen <a href="https://codepen.io/imgss/pen/NvPjde/">NvPjde</a> by imgss (<a href="https://codepen.io/imgss">@imgss</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
当选项被点击时触发`select`事件，根元素监听到`select`事件之后显示出被选中的选项。有同学会说，这个直接用点击事件不就可以了吗，但是这样写逻辑更清楚