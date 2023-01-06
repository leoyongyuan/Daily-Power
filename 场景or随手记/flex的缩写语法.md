# flex的缩写语法

flex 有三种属性，flex-grow 可拉伸 flex-shrink 可压缩 flex-basis 当前元素的宽度

- none： flex-grow: 0, flex-shrink: 0, flex-basis: auto
- 1：    flex-grow: 1, flex-shrink: 1, flex-basis: 0%
- auto:  flex-grow: 1, flex-shrink: 1, flex-basis: auto

**none 应用场景**
当flex子项的宽度就是内容的宽度，且内容永远不会换行，则适合使用flex:none。

```
<div class="container flex-none">
  <item>廖永源=懒羊羊</item>
  <item>廖永源=懒羊羊</item>
  <item>廖永源=懒羊羊</item>
  <item>廖永源=懒羊羊</item>
  <item>廖永源=懒羊羊</item>
</div>


.container {
    display: flex;
    border: 2px dashed crimson;
}

.container item {
    border: 2px solid deepskyblue;    
}
.flex-none item {
    flex: none;
}
```

![image](https://user-images.githubusercontent.com/72189350/210173594-16baf3d9-582f-42cf-8354-3b8cfe3f06f0.png)

**1 和 auto 的区别和应用场景**

结合flex属性值的描述，我们可以得出flex:1和flex:auto的行为表现：

> 元素尺寸可以弹性增大，也可以弹性变小，具有十足的弹性，但是flex:1在尺寸不足时会优先最小化内容尺寸，flex:auto在尺寸不足时会优先最大化内容尺寸。
```
<h4>flex:1</h4>
<div class="container flex-1">
    <item>廖永源===懒羊羊廖永源===懒羊羊廖永源===懒羊羊廖永源===懒羊羊</item>
    <item>lyy</item>
    <item>lyy</item>
    <item>lyy</item>
    <item>lyy</item>
</div>
<h4>flex:auto</h4>
<div class="container flex-auto">
    <item>廖永源===懒羊羊廖永源===懒羊羊廖永源===懒羊羊廖永源===懒羊羊</item>
    <item>lyy</item>
    <item>lyy</item>
    <item>lyy</item>
    <item>lyy</item>
</div>


.container {
    display: flex;
    border: 2px dashed crimson;
}

.container item {
    border: 2px solid deepskyblue;    
}

.flex-1 item {
    flex: 1;
}
.flex-auto item {
    flex: auto;
}
```

![image](https://user-images.githubusercontent.com/72189350/210173883-b60a85f4-cdd5-410a-9679-1115d4a9250c.png)


上图鲜明地体现了flex:1和flex:auto的区别，虽然都是充分分配容器的尺寸

但是flex:1的尺寸表现更为内敛（优先牺牲自己的尺寸），flex:auto的尺寸表现则更为霸道（优先扩展自己的尺寸）。

**总结：** 
- 当希望元素充分利用剩余空间，同时不会侵占其他元素应有的宽度的时候，适合使用flex:1
- 当希望元素充分利用剩余空间，但是各自的尺寸按照各自内容进行分配的时候，适合使用flex:auto

**参考链接：**
https://www.zhangxinxu.com/wordpress/2020/10/css-flex-0-1-none/
