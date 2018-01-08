
---
title: 如何用css写打印样式
tags: css
date: 2018-1-7 22:08:05
---
## 打印样式

打印样式就是针对网页被打印时设置给文档的样式，由于打印时是显示在纸上，跟屏幕还是有区别的，对于有打印需求的网页往往需要设置专门的打印样式来适配页面。



## @media print

声明自己是打印样式有两种方法：在css文件中可以使用@media print,在html文件的style标签中写上media=print属性:

```html

<style media="print">...</style>

```

当写有打印需求的页面时，最好将css分成两类，一类是@media screen ,另一类是@media print ,如果有两种media通用的css，在设置print的样式时，因为通用样式的层叠，可能会导致样式失效，这时需要采用`!important`来确保浏览器采用print下面的样式，举个例子:

```css

nav.nav{
    color: red;
    display: block;
}

@media print{
    .nav{
       display:none!important;
   }
}

```
上面的例子中去掉`!important`时，由于通用css`nav.nav`的权重更高，会导致print中的样式无效，[查看效果](https://codepen.io/imgss/pen/ZvaPLN)。所以，或者将screen和print样式完全分开。或者当打印样式无效是使用!important.
2
## @page
@page可以控制打印页面的边距大小，就像word中那样:
```css
  @page {
    margin: 1cm;
  }
```
![边距1cm](http://images2017.cnblogs.com/blog/1016471/201801/1016471-20180107222632846-1525510917.png)

## -webkit-print-color-adjust

-webkit-print-color-adjust是一个在浏览器中强制打印背景颜色和字体颜色的css属性，当打印出来的某些元素的背景颜色没有被显示时，可以使用`-webkit-print-color-adjust:exact`
## bootstrap对打印样式的支持
参考[bootcss网站的打印类](https://v3.bootcss.com/css/#responsive-utilities-print)，bootstrap对打印样式主要提供了几个class，方便我们在页面被打印时显示或隐藏一些元素：
<table class="table table-bordered table-striped responsive-utilities">
      <thead>
        <tr>
          <th>class</th>
          <th>浏览器</th>
          <th>打印机</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <code>.visible-print-block</code><br>
            <code>.visible-print-inline</code><br>
            <code>.visible-print-inline-block</code>
          </th>
          <td class="is-hidden">隐藏</td>
          <td class="is-visible">可见</td>
        </tr>
        <tr>
          <th scope="row"><code>.hidden-print</code></th>
          <td class="is-visible">可见</td>
          <td class="is-hidden">隐藏</td>
        </tr>
      </tbody>
    </table>