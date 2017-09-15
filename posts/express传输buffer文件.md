
---
title: express传输buffer文件
tags: node
date: 2017-9-15 21:51:01
---

最近要做一个功能，导出动态生成的excel文件，这个普普通通的功能却让我折腾了半天。大致流程是这样的，将数据结合excel模板通过ejsExcel库，动态生成excel文件，并发送到客户端。

在express中有两个方法:res.sendFile()和res.download()都是用来发送文件的，但是这两个方法却只接收一个路径，不接收buffer。然而ejsExcel库返回的就是一个buffer。
![](https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1758917185,591554115&fm=27&gp=0.jpg)
### 糟糕的解决办法

不难想到，大不了就先用fs把buffer存成文件，然后再把路径交给res.download不就好了，这样做是可行，但是进行了多余的操作，把buffer存成文件，res.download方法不还是要将文件读成buffer再传输？

### 解决方法
cnode社区中有一个方法写到：
res.end(buff)
![](http://images2017.cnblogs.com/blog/1016471/201709/1016471-20170915222442235-1531385331.png)

大喜过望之余，拿过去一试，妈蛋，浏览器接收到的是一个zip文件，没错，改一下后缀名excel就能打开，可是不能让用户去改后缀名吧，说好的ok呢。还差一步就是在服务器端就告诉浏览器这个文件的后缀名是啥，文件名是啥就好了。

### content disposition
其实解决方法就在res.download()方法的实现中https://github.com/expressjs/express/blob/master/lib/response.js#L526

就是这个奇怪的header在起作用。告诉浏览器这个buffer姓甚名谁。于是加了两行代码:
```js
res.set({
    'Content-Disposition': `哈哈哈.xlsx`
})
```
en,报错，不认中文。。。看来还是要用contentDisposition这个函数啊，把中文翻译一下。本着负责任的态度，附上一个demo,防止让人空欢喜:

```js
var express = require('express');

var contentDisposition = require('content-disposition');

var app = express();

var fs = require('fs');

app.get('/',function(req, res){
    var buff = fs.readFileSync('./test.txt');
    res.set('Content-Disposition', contentDisposition("这是一个excel.xlsx"))
    res.end(buff)
})
app.listen(3000);

```
这个demo将一个txt文件buffer以xlsx的格式发出去。用浏览器访问localhost:3000就可以看到效果了。

完


