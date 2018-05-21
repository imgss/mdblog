
---
title: 面试题目收集
tags: 
date: 2018-5-20 13:41:21
---
# HTML

* `<meta>`标签都有哪些作用
[答案](https://xiaohuochai.site/HTML/structure/structure_docHead.html)
* label标签for属性的作用
# CSS
* BFC的规则和触发条件
    * 内部的Box会在垂直方向，一个接一个地放置。
    * Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
    * 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
    * BFC的区域不会与float box重叠。
    * BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
    计算BFC的高度时，浮动元素也参与计算

    ### 触发条件

    * 根元素
    * float属性不为none
    * position为absolute或fixed
    * display为inline-block, table-cell, table-caption, flex, inline-flex
    * overflow不为visible
* flex布局中flex:1的作用是什么

* position属性有哪些值，在各个值下设置元素的top，left是相对于谁的

* 什么是重绘，什么是重排，如何避免不必要的重绘和重排

* 知道哪些css3伪类

* 用一个元素实现一个正三角形

* 如何清除浮动

* 如何清除margin塌陷

# JavaScript

* 函数调用有几种调用形式，this分别指向谁

* setTimeout

```JS
for(var i=0; i<5; i++){
    setTimeout(function(){
        console.log(i)
    }, 1000)
}
```
* 什么是事件委托

* 6个人为一个商品打分，最低一分，最高5分，默认4分，问这件商品的平均分分有几种结果

* lazyman
```
实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
```