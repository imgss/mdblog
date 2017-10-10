
---
title: 理解js中的运算符优先级.md
tags: js
date: 2017-10-10 22:12:31
---

## 前言

我是有过这样的经历，获取年月日是写出这样的代码 `new Date().getFullYear()`,此时的我是心虚的，因为我不知道是先执行`.`运算还是`new`运算，于是赶紧贴到控制台里，哎呦😀，没报错，看来是先执行`new`了。

让牛逼的代码再短一点，把Date后面的()去掉！得到`new Date.getFullYear()`结果这回浏览器告诉你此路不通。
### 参考链接

[JavaScript中运算符优先级的问题？](https://www.zhihu.com/question/52116922)
[虚拟机随谈（一）：解释器，树遍历解释器，基于栈与基于寄存器，大杂烩](http://rednaxelafx.iteye.com/blog/492667)
[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)


