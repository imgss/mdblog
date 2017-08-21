---
title: 认识js中的稀疏数组
tags: js
date: 2017-8-21 22:47:19
---

### 事情是这样的

今天我想写一个能快速生成一个自然数数组的函数，就是`[0,1,2,3]`这样的，然后我写了下面的代码:
```js
new Array(10).map((item, index) => {
  return index
})
```
我本以为会得到一个0-9的数组，结果确发现map方法并没有执行。原来是稀疏数组在搞鬼。

### 什么是稀疏数组

首先看下面这个问题:
```js
a = [undefined,undefined];
b = new Array(2);
```
a，b的元素个数是不是一样呢，从length上来看的一样的，都是2，就是说都有两个undefined,但是，对a和b都调用map方法却发现a的执行了，而b的没有执行。问题就在于b数组并没有两个undefined元素，而是只有两个位置，这两个位置上没有值，也不是undefined。



