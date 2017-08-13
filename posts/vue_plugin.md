
---
title: 写一个vue loading 插件
tags: vue
date: 2017-8-13 16:05:41
---
## 什么是vue插件?

- 从功能上说，插件是为Vue添加全局功能的一种机制，比如给Vue添加一个全局组件，全局指令等；

- 从代码结构上说，插件就是一个必须拥有`install`方法的对象,这个方法的接收的第一个参数是Vue构造函数，还可以接收一个可选的参数，用于配置插件：
```js
var myplugin = {
  install:function(Vue, options){
    ...
  }
}
```
- 从意义上来说，正如jQuery的`$.fn`使jQuery有了一个庞大的生态一样，Vue的插件机制使Vue形成了一个生态系统，你可以开发一个插件给别人复用。

## 使用插件
使用一个插件，只要像下面这样:
```js
  Vue.use(myPlugin)
```
## 写一个loading插件
光说不练假把式，接下来写一个loading插件练练手，这个插件被封装成一个全局组件，实现下面的效果:
![](http://images2017.cnblogs.com/blog/1016471/201708/1016471-20170813165617554-950794962.gif)
### 定义接口
我们希望应用这个插件的方式如下:
```
<loading text='imgss' duration='3'></loading>
```
其中，text用于定义loading动画显示的文字，duration定义动画时间

### 实现
新建一个loading.js文件：
```js
  let myPlugin = {
  install: function (Vue, options) {
    Vue.component('loading', {
      props: {
        text:{
          type:String
        },
        duration:{
          type:String,
          default:'1s'//默认1s
        }
      },
      data: function() {
        return {};
      },
      template: `
        <div class='wrapper'>
          <div class='loading'>
            <span style='width:20px' v-for='char in text'>{{char}}</span>
          </div>
        </div>
      `
    });
```
这里模板的作用在于，将输入的字符串转换成组成字符串的字符构成的span元素；
接下来，新建一个html文件：
```html
  <html>
  <head>
    <meta charset='utf-8'>
    <title>插件</title>
  </head>
  <body>
    <div id="app">
      <loading text='imgss'></loading>
      <loading text='我是一个粉刷匠' duration='2s'></loading>
    </div>
    <script src="http://cdn.bootcss.com/vue/2.4.2/vue.js"></script>
    <script src="./loading.js"></script>
    <script>
      Vue.use(myPlugin);
      var app = new Vue({
        el: '#app',
        data: {
        }
      });
    </script>

  </body>
</html>
```
这时基本上可以看到一个静态效果。

### 加动画
给每个元素加上一个控制上下的animation
```css
  @keyframes move {
    0% {
      margin-top: -10px;
      border-bottom: 1px solid;
    }
    50% {
      margin-top: 10px;
      border-bottom: none;
    }
    100% {
      margin-top: -10px;
    }
  }
```
除此之外，还有一下其他的公有样式代码，利用`mounted`生命周期函数，动态生成一个style标签，将css代码插到文档中:
```js
      mounted: function () {
        var cssFlag = false;
        return function () {
          if (cssFlag) {
            return;
          }
          var head = document.querySelector('head');
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerText = `
          .wrapper{
            display: flex;
            justify-content: center;
          }
          .loading {
            display: flex;
            text-align: center;
            padding-top: 30px;
            height: 50px;
            justify-content: space-between;
          }
          .loading span {
            margin-top: 0;
            animation: ease infinite move;
            display: block;
          }

          @keyframes move {
            0% {
              margin-top: -10px;
              border-bottom: 1px solid;
            }
            50% {
              margin-top: 10px;
              border-bottom: none;
            }
            100% {
              margin-top: -10px;
            }
          }`;
          head.appendChild(style);
          cssFlag = true;
        };
      }(),
```
然后通过控制span的animation-delay来模拟曲线:
```html
<span 
    :style='{
      width: "20px", 
      animationDuration: duration.indexOf("s") === -1 ? duration + "s" : duration , 
      animationDelay: parseInt(duration)/text.length*index +"s"
    }' 
    v-for='char,index in text'>
    {{char}}
  </span>
```
到这里，插件基本完成,看一下效果:

![](http://images2017.cnblogs.com/blog/1016471/201708/1016471-20170813185409585-1719460896.gif)

### demo
  [代码](https://github.com/imgss/imgss.github.io/tree/master/demo/loading)

<p data-height="248" data-theme-id="27057" data-slug-hash="zddbzr" data-default-tab="html,result" data-user="imgss" data-embed-version="2" data-pen-title="zddbzr" class="codepen">See the Pen <a href="https://codepen.io/imgss/pen/zddbzr/">zddbzr</a> by imgss (<a href="https://codepen.io/imgss">@imgss</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>




