
---
title: 理解go中的interface
tags: go
date: 2018-2-4 20:13:05
---
## 什么是interface

interface对于一个半路出家的前端来说是一个新鲜玩意儿。由于换了工作，后台是go开发的，所以有必要学一点go语言的知识。最近被struct和interface搞得有点晕，struct还能类比js中的class，但是为什么又要搞个interface，它和struct之间的关系又是什么，下面就按照我的理解来浅谈一下。

## 什么是interface

在go语言中，interface是一组方法的集合。另一方面，interface是go的一个类型。一个类如果实现了这些方法，我们就说它实现了这个接口。

## interface 和 struct 的联系和区别

1. interface和struct都是go语言中的一种数据类型，都由type关键字定义:

```go
type Bird struct {
    name string
    color string
}
type Plane struct {
    name string
    color string
}
type Flyer interface {
    fly()
}
type Runner interface {
    run()
}
```
上面的例子中定义了四种类型，`Bird`,`Plane`是struct；`Flyer`,`Runner`是interface；其实我们可以看出，struct和interface是对事物描述的两种方式，一个是从物体有什么属性来描述，另一个是从物体能干什么来
## 实现接口

如果一个struct有了一个interface所定义的方法，我们就说它实现了这个接口。让我们来实现飞行这个接口。
```go
func (duck Bird) fly(){
    fmt.Print(duck.name, "is flying")
}
gaga := Bird{"gaga","yellow"}

func (airBus Plane) fly(){
    fmt.Print(airBus.name, "is flying")
} 
airBus := Plane("airBus","white")
gaga.fly()
airBus.fly()
```
从上面的例子中可以看出，鸭子可以飞，飞机也可以飞，他们都实现了flyer这个接口，所以一个接口可以由多个struct实现，反过来，一个struct也可以实现多个接口，比如，Bird还可以实现runner这个接口。所以两者是对事物的两种不同的描述方式，是数学中集合的概念。是你中有我，我中有你的关系。

## 为什么要接口

由于我还是个go方面的菜鸟，就简单说一下我的理解。拿现实生活中的例子来说，招聘职位的要求中，有的会要求学历，这是求职者的属性，可以用struct来定义；有的会要求掌握某些技能，比如精通javascript,这就要接口了，上面的例子用代码表示如下:
```go
type Degree struct {
    name string
}
type Jser interface {
    writeJs ()
}
func (person Degree)writeJs(){
    print("I can write js")
}
me = Degree{name:"benke"}
func wanted(guy Jser){
    guy.writeJs()
    println("not bad")
}
func main(){
    wanted(me)
}
```

