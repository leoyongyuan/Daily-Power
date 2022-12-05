# 异步渲染

## 什么是Vue的异步渲染？

和异步渲染对应的是同步渲染，同步渲染就是数据更新后，DOM视图立刻更新。而异步渲染则是会先等所有的数据都更新完成，才响应页面来渲染视图。

## Vue为何采用异步渲染，有什么好处？

可以提高性能。

如果不采用异步更新，那么每次数据更新都会渲染视图，就会严重挤占性能空间。因此采用异步渲染，就可以等本轮的数据都更新完成后，再去渲染视图。

## 异步渲染的过程？

在Vue中会有一个叫notify来监控数据变化，如果数据发生变化，就会用一个watcher的对象，把数据包裹起来，然后推送到队列中。

接着会对队列进行一个排序去重，只保留最后一次数据发生变化的watcher。

最后通过nextTick异步执行队列里面的watcher，更新视图。

![image](https://user-images.githubusercontent.com/72189350/205595632-6e5a6fef-8063-4210-8014-64f293c8d0ee.png)

## Vue中nextTick()的原理和作用？

nextTick 其原理就是利用 Promise，MutationObserver,setlmmediate,setTimeout的原生Javascript API,利用降级策略，来模拟宏任务/微任务的实现。

其本质就是利用了Javascript的异步回调任务队列在实现Vue中的异步回调队列。

所谓降级策略，就是Vue在内部实现的时候，对异步队列按顺序先使用Promise.then,MutationObserver 和 setlmmediate，最后实在没办法才用setTimeout。

![image](https://user-images.githubusercontent.com/72189350/205668658-a3abb5e9-54c7-44a5-b739-64c0a3b06510.png)
