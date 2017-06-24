
---
title: vue实现3D标签云
tags: vue svg
date: 2017-6-24 20:43:29
---
## 闲扯两句

最近想给自己的博客上加上一个3D标签云的效果，用来表示自己博客文章的分组，网上找到了[canvas](https://github.com/goat1000/TagCanvas)实现的，还有a元素实现的[解析3D标签云](http://www.cnblogs.com/axes/p/3501424.html)，我想让标签可以选择和点击，又不想在标签数量较多时操作a标签导致性能问题，于是svg就成了一个不错的选择。

## 标签初始化

这里实现的核心主要是参考了前面的那篇解析3D标签云的文章，作者给出了源码，讲解也比较通俗易懂。大体来说，整个代码分三步：

- 根据标签的数量，算出每个标签在球面上分布的x,y,z坐标
- 根据标签的坐标，将标签绘制出来，x,y坐标通过标签的位置来表示，z坐标通过标签字体的大小和透明度来表示
- 通过函数根据球的旋转**角速度**不断计算标签新的x,y坐标，制造出旋转效果
- 通过mousemove事件，根据鼠标坐标值，改变球旋转的角速度，做出交互效果

贴上代码:
```html
    <div id='app' >
        <svg :width='width' :height='height' @mousemove='listener($event)'>
            <a :href="tag.href" v-for='tag in tags'>
                <text :x='tag.x' :y='tag.y' :font-size='20 * (600/(600-tag.z))' :fill-opacity='((400+tag.z)/600)'>{{tag.text}}</text>
            </a>
        </svg>
    </div>
```
在模板中，借用指令`v-for`来渲染标签，每个标签上绑定了x,y,font-size(用来表现z轴),fill-opacity(都是与z坐标有关的表达式，用来表现z轴),及text;
```js
  data: {
      width:700,//svg宽度
      height:700,//svg高度
      tagsNum:20,//标签数量
      RADIUS:200,//球的半径
      speedX:Math.PI/360,//球一帧绕x轴旋转的角度
      speedY:Math.PI/360,//球-帧绕y轴旋转的角度
      tags: []
  }
  computed:{
      CX(){//球心x坐标
          return this.width/2;
      },
      CY(){//球心y坐标
          return this.height/2;
      }
  },
```
做好了上面的基础，下面我们来初始化标签数据：

```js
  created(){//初始化标签位置
      let tags=[];
      for(let i = 0; i < this.tagsNum; i++){
          let tag = {};
          let k = -1 + (2 * (i + 1) - 1) / this.tagsNum;
          let a = Math.acos(k);
          let b = a * Math.sqrt(this.tagsNum * Math.PI)//计算标签相对于球心的角度
          tag.text = i + 'tag';
          tag.x = this.CX +  this.RADIUS * Math.sin(a) * Math.cos(b);//根据标签角度求出标签的x,y,z坐标
          tag.y = this.CY +  this.RADIUS * Math.sin(a) * Math.sin(b); 
          tag.z = this.RADIUS * Math.cos(a);
          tag.href = 'https://imgss.github.io';//给标签添加链接
          tags.push(tag);
      }
      this.tags = tags;//让vue替我们完成视图更新
  },
```
到了这里，我们就算了算坐标，vue完成了视图更新的工作，这时基本上就可以得到一副静态的图像了：
![静态标签云](http://images2015.cnblogs.com/blog/1016471/201706/1016471-20170624213737429-455452972.png)
下面就是通过改变每一个tag的x,y的值来使球旋转起来；实现方法是rotateX,rotateY函数：
```js
    rotateX(angleX){
        var cos = Math.cos(angleX);
        var sin = Math.sin(angleX);
        for(let tag of this.tags){
            var y1 = (tag.y- this.CY) * cos - tag.z * sin  + this.CY;
            var z1 = tag.z * cos + (tag.y- this.CY) * sin;
            tag.y = y1;
            tag.z = z1;
        }
    },
    rotateY(angleY){
        var cos = Math.cos(angleY);
        var sin = Math.sin(angleY);
        for(let tag of this.tags){
            var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
            var z1 = tag.z * cos + (tag.x - this.CX) * sin;
            tag.x = x1;
            tag.z = z1;
        }
    },
```
这两个函数就是根据标签原来的坐标和球旋转的角度算出新的坐标，最后在mounted钩子下面，写一个animate函数，不断调用这两个函数，实现旋转动画

```js
    mounted(){//使球开始旋转
        setInterval(() => {
            this.rotateX(this.speedX);
            this.rotateY(this.speedY);
        }, 17)
    },
```
全部代码如下:
```js
      <script>
        var app = new Vue({
            el: '#app',
            data: {
                width:700,
                height:700,
                tagsNum:20,
                RADIUS:200,
                speedX:Math.PI/360,
                speedY:Math.PI/360,
                tags: []
            },
            computed:{
                CX(){
                    return this.width/2;
                },
                CY(){
                    return this.height/2;
                }
            },
            created(){//初始化标签位置
                let tags=[];
                for(let i = 0; i < this.tagsNum; i++){
                    let tag = {};
                    let k = -1 + (2 * (i + 1) - 1) / this.tagsNum;
                    let a = Math.acos(k);
                    let b = a * Math.sqrt(this.tagsNum * Math.PI);
                    tag.text = i + 'tag';
                    tag.x = this.CX +  this.RADIUS * Math.sin(a) * Math.cos(b);
                    tag.y = this.CY +  this.RADIUS * Math.sin(a) * Math.sin(b); 
                    tag.z = this.RADIUS * Math.cos(a);
                    tag.href = 'https://imgss.github.io';
                    tags.push(tag);
                }
                this.tags = tags;
            },
            mounted(){//使球开始旋转
                setInterval(() => {
                    this.rotateX(this.speedX);
                    this.rotateY(this.speedY);
                }, 17)
            },
            methods: {
                rotateX(angleX){
                    var cos = Math.cos(angleX);
                    var sin = Math.sin(angleX);
                    for(let tag of this.tags){
                        var y1 = (tag.y- this.CY) * cos - tag.z * sin  + this.CY;
                        var z1 = tag.z * cos + (tag.y- this.CY) * sin;
                        tag.y = y1;
                        tag.z = z1;
                    } 
                },
                rotateY(angleY){
                    var cos = Math.cos(angleY);
                    var sin = Math.sin(angleY);
                    for(let tag of this.tags){
                        var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
                        var z1 = tag.z * cos + (tag.x-this.CX) * sin;
                        tag.x = x1;
                        tag.z = z1;
                    } 
                },
                listener(event){//响应鼠标移动
                    var x = event.clientX - this.CX;
                    var y = event.clientY - this.CY;
                    this.speedX = x*0.0001>0 ? Math.min(this.RADIUS*0.00002, x*0.0001) : Math.max(-this.RADIUS*0.00002, x*0.0001);
                    this.speedY = y*0.0001>0 ? Math.min(this.RADIUS*0.00002, y*0.0001) : Math.max(-this.RADIUS*0.00002, y*0.0001); 
                }
              }
          })
    </script>
```
[完整demo](https://imgss.github.io/demo/svg/svg3D.1.html) · [vue](https://github.com/imgss/imgss.github.io/blob/master/demo/svg/svg3D.1.html) · [no vue](https://github.com/imgss/imgss.github.io/blob/master/demo/svg/svg3D.html)
![](http://images2015.cnblogs.com/blog/1016471/201706/1016471-20170624224821898-2043160511.gif)
### 总结
vue的数据绑定可以减少我们对dom的操作，而将关注点放在逻辑上面，vue构造函数提供的几个选项可以帮助我们更好的组织代码
