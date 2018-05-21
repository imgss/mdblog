---
title: 从lazyman谈谈流程控制
tags: 流程控制 js
date: 2017-06-02 23:41
---
> 参考文章:http://web.jobbole.com/89626/

## 一道面试题
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

以此类推。
```
原文中给出了答案，这个题主要考察的有几个方面：
1. 链式调用
2. 原型
3. 对异步的掌握
4. 高大上的任务队列
### 1.链式调用
链式调用最经典的就是`jQuery`了，原理就是，对象执行完一个方法之后返回this，实现链式调用：
```js
var obj = {
    a:function(){
        console.log('方法a');
        return this;
    },
    b:function(){
        console.log('方法b');
        return this;
    }
}
obj.a().b().a().b()
```
### 2.原型
通过原型，你可以把实例通用的方法挂载到他构造函数的原型上，实现代码的复用。以这个题目为例：lazyman有eat,sleep,sleepFirst等方法，可以挂载到原型对象上，而LazyMan是一个构造函数，接受一个name参数，生成一个有名字的lazyman实例。

接下来我们一步一步来完成。
1. 打印名字
    ```js
        function LazyMan(name) {
            // 支持不带new关键字调用构造函数
            if(! (this instanceof LazyMan)){
                return new LazyMan(name);
            }  
            console.log("Hi! This is " + name + "!");
        }
    ```
2. eat方法
    ```js
        LazyMan.prototype.eat = function(food){
            console.log('Eat ' + food + '~');
            return this;// 用来链式调用
        }
        //LazyMan('Hank').eat('a').eat('b')
    ```
### 异步和sleep方法

参照前面的方式，我可能会这样实现sleep方法：
```js
    LazyMan.prototype.sleep = function(time){
        var self = this;
        setTimeout(function(){
            console.log('Wake up after ' + time);
            return self;
        },time*1000)
    }
    LazyMan('Hank').sleep(5).eat('a') //err Cannot read property 'eat' of undefined
```
由于sleep函数直接返回了undefined，而把处理函数放到了执行队列中，导致后面的链式调用出错。这时就需要我们的任务队列出马了。
### 4.任务队列

任务队列对应的是队列这种先进先出的数据结构，通过实现一个next方法可以让队列中的任务顺序执行。