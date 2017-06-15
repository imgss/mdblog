---
title: 重新认识string.prototype.replace
tags: js 内置方法
date: 2017-6-15 21:07:13
---
字符串的replace方法是操作字符串的常用方法之一，但这个方法只有当与正则合并使用时，才能体现出它的强大之处。

> 语法：`str.replace(regexp|substr, newsubStr|function)`;
    <br>返回值： 一个部分或全部匹配由替代模式所取代的新的字符串，因为字符串是不可变的原始类型。

## 基础用法

str.replace(substr, newsubStr);将字符串的一个子字符串，替换为另一个新的子字符串。比如:

```js
'eabcabcabcabc'.replace('ab','df')//返回'edfcabcabcabc',只替换第一个子串
'abcabcabcabc'.replace(/ab/g,'df')//返回'dfcdfcdfcdfc',由于正则表达式的g,替换掉所有匹配到的`ab`
```
## 带正则的用法
其实前面已经带了一个简单的正则，但是这并没有显出如虎添翼的效果。想象一个场景，你想把一个类似于`201706`的字符串替换成`2017-06`的形式,我们可以这样实现:
```js
'201706'.replace(/(\d{4})(\d{2})/,'$1-$2')//'2017-06'
'13299259212'.replace(/(\d{3})(\d{4})(\d{4})/,'$1-$2-$3')
```
这个地方主要在于正则的捕获，上面的正则表达式,`\d{4}`匹配字符串的前四个数字,`\d{2}`匹配后两个数字,分别用小括号包起来，放到后边对应的`$1`,`$2`中,这里的`$1`和`$2`不是字面的意思。而是两个**占位符**,:smile:

除了`$n`这个匹配捕获的占位符外，还有`$&`, ``$` ``,`$'`这三个占位符：
说个题外话,一分钟前搜了一下，用markdown转义\`字符时，最外层用两个 \`\`将里面的\` 包起来就行，看起来像这样\`\` $\` \`\`
MDN描述如下:

|变量名|代表的值|
|--|:-----------------|
|`$$`|	插入一个 "$"。|
|`$&`|	插入匹配的子串。|
|$`|	插入当前匹配的子串左边的内容。|
|`$'`|	插入当前匹配的子串右边的内容。|
|`$n`|假如第一个参数是 RegExp对象，并且 n 是个小于100的非负整数，那么插入第 n 个括号匹配的字符串。|
前面说了$n,$$相当于转义$
```js
'abc'.replace(/b/,"$`")//aac,b前面是a,所以将b替换成a，得到a（a）c
'abc'.replace(/b/,"$'")//acc,b后面是c,所以将b替换为c，得到a(c)c
'aaabccc'.replace(/b/,"$`$'")//aaaaaacccccc，你懂的

'abcdefg'.replace(/b|c|f/g,'$&O')//abocodefog,这里$&分别代表bcf
'abcdefg'.replace(/(ab)c(de)/g,'$&O')//abcdeofg,这里$&代表abcde
'abcdefg'.replace(/\S{3}/g,'$&O')//abcOdefOg,这里$&代表abc和def
```
## 带函数的用法
这里就是将函数作为replace方法的第二个参数了，可以看作是上面的函数版和加强版

```js
function replacer(match,$1,$2,$3,offset,string){
    console.log('$&',match);
    console.log('$1',$1);//132
    console.log('$2',$2);//9925
    console.log('$3',$3);//9212
    console.log('开始位置',offset);
    console.log('string',string);
    return(`${$1}-${$2}-${$3}`);
}
'13299259212'.replace(/(\d{3})(\d{4})(\d{4})/,replacer)
```
可以看出正则的占位符写法更直观也更简便，但函数写法会更自由。
参考链接:MDN<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Syntax>
    
