
---
title: gulp管理静态资源缓存
tags: gulp
date: 2017-12-21 19:09:27
---
前端项目在版本迭代的时候，难免会遇到静态缓存的问题，明明开发的是ok的,但是一部署到服务器上，发现页面变得乱七八糟，这是由于静态缓存引起的。

![](http://images2017.cnblogs.com/blog/1016471/201712/1016471-20171221191311646-565844603.png)

从上面这张图片可以看出，浏览器加载css,js等资源时，size一栏是**from cache**,也就是直接使用了本地的资源，而没有向服务器请求。这样做的好处是提升页面渲染速度，坏处是当服务器的对应的文件发生变化时，浏览器却还是使用缓存，造成布局混乱的问题。

### 解决办法

一个比较原始的办法是在修改了文件之后，手动改变文件名称，然后再在html手动更新资源的path名称。打个比方，你有一天更新了a.css的样式，然后加个日期后缀，把它重命名为`a-1221.css`，同时在应用这个css的html中改成:
```html
<link href="./css/a-1221.css" rel="stylesheet"/>
```
这时，但浏览器发现需要加载这个样式时，发现自己只有a.css,没有a-1221.css，就会向服务器发起请求了。不过，很明显，这种活大家是都不愿意干的，尤其是css文件一多的时候，绝对懵逼，所幸我们可以让gulp来帮我们完成这些乏味的工作。

### gulp-rev 和 gulp-rev-collector

这是两个gulp的插件，gulp-rev可以根据静态资源的得出文件的hash值，当文件内容发生改变时，这个hash值也会发生变化。并生成一个json文件,大概长这个样子:
```json
{
    "base/index.css": "base/index-c52f09f203.css"
}
```
文件的后缀变成了这个文件的hash值。gulpfile.js中的代码如下:
```js
var rev = require('gulp-rev');
var gulp = require('gulp');
gulp.task('revCss', function(){
  return gulp.src(cssUrl)//你存放css的目录 
 .pipe(rev())        
 .pipe(rev.manifest())
 .pipe(gulp.dest('rev/css'));//在rev/css目录下生成json文件
 });
```
这个插件只解决了问题的一部分，也就是，把文件变动和hash值关联了起来，另一部分改变html的请求路径还要靠第二个插件gulp-rev-collector来完成。这个插件完成的事情也很简单，就是把html中的资源路径，通过正则匹配，替换成更新后的路径。代码如下:

```js
var gulp = require('gulp');
var revCollector = require('gulp-rev-collector');
 gulp.task('revHtml', function () {
  return gulp.src(['rev/**/*.json', 'views/*.html'])
 .pipe(revCollector())
 .pipe(gulp.dest('views/inc/'));
});
```
所以这两个插件就解决问题了吗？可惜并不是这样。因为你的css文件名并没有更改，还是原来的a.css,所以还需要一个插件帮我们解决重命名的问题。比如用来重命名文件的gulp-rename。
```js
var rename = require("gulp-rename");
var json = require('./rev-manifest.json');//rev生成的文件

gulp.task('rename',function(){
  var json = require('./rev/css/rev-manifest.json');
  var Path = require('path');
  gulp.src("static/css/*.css")
  .pipe(rename(function (path) {
    path.basename  = json[path.basename + '.css'].replace('.css', '');//改掉css文件名为含有hash值的文件名
  }))
  .pipe(gulp.dest("./dist"));
})
```
### 查询参数管理缓存

这种方法适用于不生成build文件的项目，这时再去重命名静态文件就会显得很麻烦。所以出现了这种做法，就是在静态资源发生变化时，文件名不改变，但是html中请求路径的查询参数会发生变化,像下面这样:
```html
<link rel="stylesheet" href="/css/style.css?v=2h3h2ar">
```
这个查询参数v对于后台来说，没有什么意义，你完全可以改成a,b,c。但是当查询参数的hash值发生变化时，却会让浏览器去请求，从而更新缓存。如果你想用这种方式，可以使用**gulp-rev-query**（[github](https://github.com/hingsir/gulp-rev-query)）插件和**[gulp-rev-collector-query](https://github.com/hingsir/gulp-rev-collector-query)**，将文件名转换成查询字符串。(**插件的一个bug是对于.min.css会解析错误**)
```json
{
  "base/index.css": "base/index.css?v=1ead88a42c"
}
```
下面是我参考作者的写的一个，解决了min.js的问题，其实就是改了正则:

```js

var through = require('through2');

module.exports = function(ver) {
    var ver = ver || 'v'
    // convert a-xxxxxxxx.css to a.css?ver=xxxxxxxx
    function hashToQuery(file) {
        var content = new String(file._contents);
        content = content.replace(/(.+)\-(.{7,10})(\..+)"/g, function(match, p1,p2,p3,offset,string){
            return  `${p1}${p3}?${ver}=${p2}"`
          });
        file._contents = new Buffer(content);
        file.ver = ver;
        return file;
    }
    return through.obj(function(file, encoding, callback) {
        callback(null, hashToQuery(file));
    });
};
```

最后，祝大家圣诞快乐！