# 生命周期

## 什么是Vue的生命周期？

生命周期是对于Vue中的组件，从创建->运行->销毁的过程。

## 生命周期的几个阶段

1.创建阶段

- `beforeCreate` 会初始化生命周期函数，但是props，data，methods这些都未初始化。
- `created` 第一关键点，props，data，methods等初始化完成，可以获取数据，作一些数据交互的事。
- `beforeMount` 会获取上一阶段的数据来渲染template模板，但是未在浏览器中渲染
- `mount` 第二关键点，模板渲染完毕，可以开始调用DOM元素。

2.运行阶段

在运行阶段，组件已经完全创建成功，但是可能数据会被频繁修改，因此有了两个新的生命周期函数来改变处理

- `beforeUpdate` 准备数据和DOM事件的更新，但是无法获取到新修改的DOM事件
- `updated` DOM事件更新完成，可以获取到最新的DOM事件。

3.销毁阶段

- `beforeDestory` 销毁前的一个阶段，依然保留着组件功能
- `destoryed` 被销毁啦


## Vue3的生命周期

vue3的区别和vue2在于有vue3是组合api，用一个setup() 包含了data，compute，methods等api，因此在生命周期方面其实也只是把beforeCreate 和 created 合并为一个 叫setup。
