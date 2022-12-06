# 响应式和双向绑定

## 什么是响应式（MVVM）？

响应式就是数据发生改变后，会通知使用到该数据的代码，让其视图也自动更新。

## Object.definePropty的了解？

`Object.definePropty` 是用来定义一个对象属性。

有三个参数。
- 第一个实例对象，作为属性的载体
- 第二个传入属性名
- 第三个传入一个对象，来定义这个属性名的其它属性。如：get，set，value，可枚举，可修改等。。

```Javascript
Object.defineProperty(data,key, {
    enumerable:true,
    get() {
        return val;
    },
    set(newval) { // 更改值
        if (newval === val) return;
        val = newval;
    },
})
```

## vue的响应式原理？

vue的响应式原理是利用**数据劫持+发布订阅的模式**来实现的。

1.在vue中拿到数据后，会先对数据进行一个数据劫持，就是给对象中的数据都利用`Object.defineProperty`在挂载上get/set 属性，具体就是用`observe`去递归搜索对象。挂载上
get/set，就可以利用发布订阅用`watcher`去收起依赖。

2.接着用一个`Dep`负责数据依赖的收集，其实就是用一个数组来实现发布订阅的模式，上游对接`Observer`，下游对接`Watcher`。

3.`Watcher`其实一个类，用来给数据对象附上一些属性和方法。

总结整个流程：首先data闯入`observer`用数据劫持转成get/set形式，当在`Watcher`触发get,将其收集到事件池`Dep`中。而当数据更新时，会触发set，就会在`Dep`事件池中通知的所
有`Watcher`去更新。


## 手写一个MVVM试试？

### 数据劫持

### 数据代理

### 编译模板

### 发布订阅

### 双向绑定

## 单向数据流和双向绑定？
