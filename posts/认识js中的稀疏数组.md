---
title: [undefined,1] 和 [,1]的区别在哪里--认识js中的稀疏数组
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
### [undefined,1,undefined,] 和 [,1,,]的区别在哪里

有一个直观的方法可以得到上面的结论,就是借助`hasOwnProperty`方法，有人可能会奇怪，这个不是用来判断对象是否有一个自己的属性的吗?其实，在js中，没有方法，只有函数的方法形式的调用。常见的一个用法是，将一个类数组对象变成一个数组:

#### 函数调用的四种方式

你知道回字的四种写法吗？不知道没关系，但是你要知道函数的四种调用方式:
1. 普通调用   b()
2. 方法调用   a.b()
3. call,apply调用  [].slice.call(arguments)
4. new 调用 new A()
更多详情可以参考这篇文章[函数的四种调用方式](http://www.cnblogs.com/jiaozhuo/p/5751002.html)
![回字的四种写法](
https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503508685431&di=dc6e3b02a8517f2195ff9c33a22e619a&imgtype=0&src=http%3A%2F%2Fimg02.3dmgame.com%2Fuploads%2Fallimg%2F150715%2F158_150715081948_1_lit.jpg)
``` js
var divs = document.querySelectorAll('div');
Array.isArray(divs)//false
divs = [].slice.call(divs)
Array.isArray(divs)//true
```
这里就是对一个类数组对象调用数组的方法，使它变成一个数组。下面，我们来看看如何借助`hasOwnProperty`让稀疏数组现出原形。首先，定义两个数组。
``` js
var a = [,1,,];
var b = [undefined,1,undefined];
```
#### 借助索引运算试试

上面，我们定义了两个数组，通过索引运算得到的值都是相同的:
``` js
for(var i = 0; i < a.length; i++){
  console.log(a[i] === b[i])
}
//打印出3次true
```
所以，索引运算是判别不出真假孙悟空的,接下来我们请出`hasOwnProperty`同学:
#### 借助hasOwnProperty

``` js

var hasOwnProp = Object.prototype.hasOwnProperty;

hasOwnProp.call(a, '0'); //false

hasOwnProp.call(b, '0'); //true

hasOwnProp.call(a, '1'); //true

hasOwnProp.call(b, '1'); //true

```

所以神奇吧，虽然`a[0]===b[0]`;都是undefined,但是，稀疏数组在['0']的位置是没有值的，而b数组确实有值的，只不过是undefined罢了；而稀疏数组在[1]的位置上则有值，那这么说，稀疏数组真的是名副其实了。其实除了在1的位置有值之外，稀疏数组还有一个自己的属性，就是`length`了，这么重要的属性怎么能丢呢
``` js
hasOwnProp.call(a, 'length'); //true

```

#### 总结
  现在。我们差不多可以解释最开始的问题了，map函数的内心os可以是这样的：

    > 没有值你让我迭代个毛线。。。

  总体上来说，稀疏数组还是**人畜无害**的,只是在调用数组自己的迭代方法时要注意一下；如forEach,map,filter等，函数会跳过那些稀疏的位置，最后放一个快速生成自然数的链接，https://segmentfault.com/q/1010000005667882


