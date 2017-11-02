
---
title: Vue.js之render函数基础
tags: vue
date: 2017-11-1 20:04:46
---
刚才翻了一下博客，才发现，距离自己写的第一篇Vue的博客[vue.js之绑定class和style](http://www.cnblogs.com/imgss/p/6013663.html)(2016-10-30)已经过去一年零两天。这一年里，自己从船厂的普通技术员，成为了一个微型不靠谱创业公司的普通码农。发过一次烧，搬了两次家，没攒下什么钱。好，牢骚发到这里，接下来谈谈传说中接近Vue底层的api==render函数。

## 一枚硬币的两面

很久很久以前，前端的数据和视图居住在一起，在强大的jQuery的管理下，他们相处的还算可以。但是随着页面越来越复杂，DOM树的节点越来越多，数据夹杂在DOM中变得越来越难于管理。于是一声炮响，迎来了数据驱动视图的MVVM框架，数据和视图被一条天河划分开来，整个页面的数据状态开始变得整洁起来。而连接数据视图的鹊桥是虚拟DOM,关于虚拟DOM参看[全面理解虚拟DOM，实现虚拟DOM](http://www.ituring.com.cn/article/211352)。构成DOM的每一个节点在Vue中被称为vnode。（这段不严谨，大胆假设没求证）

在我们生成真实的DOM结构时，可以写一个HTML文件描述文档结构交给浏览器去解析，同时也可以通过DOM 的api innerHTML告诉浏览器结构是什么，还可以用createElement来构建DOM树，以喜闻乐见的hello world为例，html和innerHTML api 对DOM结构的描述都是`<h1>hello world</h1>`，但是用createElement就变成了这个样子:
```js
var h1 = document.createElement('h1');
var hw = document.createTextNode('hello world')
h1.appendChild(hw);
document.body.appendChild(h1);
```
这就是描述一个DOM结构的方式，你可以用一个html文件，一个字符串，或者一段js代码，但是他们都是在做同一件事，就是告诉浏览器该怎么渲染你想要的页面。现在我们回头看vue,在构建vue实例时，我们要写一个叫template的属性，里面是一个html一样的字符串。那么，vue对这个字符串做什么了？肯定不是羞羞的事情。事实上，vue拿它构建了虚拟DOM。

`Vue.compile`这个静态方法给我们展示了一个漂亮的字符串模板是怎么变成一个奇怪的render函数的:
```js
Vue.compile('<h1>hello world</h1>')

//返回
{staticRenderFns: Array(0), render: ƒ}
```
render属性对应的是一个函数，在**Vue的实例的上下文**中调用它会得到字符串对应的虚拟DOM节点,可以把下面的代码粘贴到Vue官网的控制台下面看看效果：

```js
let r = Vue.compile('<h1>hello world</h1>');//得到{staticRenderFns: Array(0), render: ƒ}
r.render.call(new Vue({}))

//返回 VNode {tag: "h1", data: undefined, children: Array(1), text: undefined...}
```
于是我们抽丝剥茧，终于看到了VNode长什么样子，有tag属性，还有children，text...总之咋一看，还真的跟真实的DOM对象有几分相似，真实DOM中有`tagName`,`children`,`textContent`...

## render函数

上面我们看到了render函数和模板字符串不同寻常的关系以及通过Vue.compile进行转换，下面来看看render函数的具体构造。要注意的是，编译后得到的不是VNode树，而是生成VNode的函数。

在创建Vue实例的过程中，如果传入的选项中有template和render两个属性，render会有更高的优先级：
```js
new Vue({
    template:'...',
    render:f(){}//优先级高
})
```

这就表示，Vue在看到你要用render函数描述虚拟DOM时。会很高兴，因为它不用自己编译你给他的模板字符串来得到render函数，省力又省心。同时它会丢给你一个函数，这个函数是你构建虚拟DOM所需要的工具，官网上给他起了个名字叫createElement。还有约定的简写叫h,vm中有一个方法_c,也是这个函数的别名。

下面我们先来说说这个构建虚拟Dom的工具，createElement函数。[参考官网createElement-参数](https://cn.vuejs.org/v2/guide/render-function.html#createElement-参数)，首先思考一个普通的html元素会传递给我们哪些信息，`<h1 class='foo'>hello world</h1>`,没错，我们可以得到3部分有效信息：
1. 这个元素的标签名--h1
2. 这个元素有什么属性/事件，class,style,onclick,name,id...
3. 这个元素有什么子元素，这里是一个文本节点 'hello world'

上面提到，render函数和模板字符串是描述虚拟DOM树的两种方式,那么用createElement函数来描述就变成了下面这样：
```
craeteElement('h1', {class,style,on,attrs:{name,id}, 'hello world'})
//这里，第三个参数还有玄机，接收的参数十分灵活，详情参考官网关于这三个参数的描述
```
看到了吧，之前我们从字符串中得到的有效信息到了函数这边变成了输入的参数，而输出这是一个虚拟DOM节点。我们不妨叫他们createElement三剑客。
### 大剑客
参数类型是一个字符串或者一个对象一个函数。像下面这样：
```js
'div'//字符串
{
    data:{},
    methods:{},
    mounted:{}
}//一个组件选项对象
function(){return 'div'}//返回上面两种
```
### 二剑客
一个数据对象，包括对根元素html属性的描述，和组件属性的描述，详情见官网，比方说你要描述这么一个节点：

`<man class="color" height="1.4m" weight="50kg" v-on:move="handle" />`

需要传入的第二个参数应该是
```js
{
    'class':{color:true},
    props:{height:'1.4m', weight:'50kg'}，
    on:{move:function handle(){}}
}
```
### 三剑客
三剑客可以是一个字符串或者一个数组，数组就表示这个根元素不止有一个虚拟子节点了。还是举个例子:

`<h1> <span style="color:red">hello</span> <span>world</span> </h1>`

要给createElement传入的第三个参数(第二个参数，由于根元素没什么属性，可以省略)应该是:
```js
vm = new Vue({
    render:createElement => createElement('h1',[
        createElement('span',{style:{color:'red'}},'hello'),
        createElement('span','world')
    ])
});
vm.$mount('#logo');
```
可以把代码复制到vue官网的控制台看效果。其实render函数和slot还可以擦出不一样的火花，就到下篇介绍了。本篇完。
