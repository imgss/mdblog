---
title: conglazyman谈谈流程控制
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

### 4.任务队列

任务队列对应的是队列这种先进先出的数据结构