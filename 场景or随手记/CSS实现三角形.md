# [CSS实现三角形](https://juejin.cn/post/6950081305560219679#heading-3)

## border绘制

用border是最简单的方法，设置一个宽高都为0的盒子，在设置border的颜色即可。在想要哪个方向就把保留这个方向的颜色，其它的用`transparent`透明掉即可。

```css
<div class='normal'></div>

div {
  width: 0px;
  height: 0px;
}

.normal {
  border-top: 50px solid yellowgreen;
  border-bottom: 50px solid deeppink;
  border-left: 50px solid bisque;
  border-right: 50px solid chocolate;
}
```

![image](https://user-images.githubusercontent.com/72189350/211196740-6401322e-1f68-436c-b43a-27930dad2e4c.png)


用`transparent`透明。
```css
<div class='top'></div>
<div class='bottom'></div>
<div class='left'></div>
<div class='right'></div>

div {
  width: 0px;
  height: 0px;
  margin: auto;
}

.top {
  border: 50px solid transparent;
  border-bottom: 50px solid deeppink;
}

.left {
  border: 50px solid transparent;
  border-right: 50px solid deeppink;
}

.bottom {
  border: 50px solid transparent;
  border-top: 50px solid deeppink;
}

.right {
  border: 50px solid transparent;
  border-bottom: 50px solid deeppink;
}
```

![image](https://user-images.githubusercontent.com/72189350/211196770-2fd630f3-7579-4581-a2d5-3a4b356179bd.png)


## linear-gradient 绘制三角形

[linear-gradient](https://www.w3cplus.com/css3/do-you-really-understand-css-linear-gradients.html) 可以为一个盒子设置渐变效果。

linear-gradient会有一条渐变线，横跨整个盒子模型，我们可以通过调整第一次参数来改变线的度数，最开始0度是水平，随着增加会顺时针转动。

![image](https://user-images.githubusercontent.com/72189350/211196926-245c18a1-ad41-4172-9b9b-c08112fec589.png)

借助这个根渐变线，就可以设置颜色效果，设置多少种颜色，就会划分为多少个颜色区域，并且也可以设置每个颜色区域的百分比大小。

![image](https://user-images.githubusercontent.com/72189350/211197220-76c6babf-0abe-4712-be41-baa0c3e8b448.png)

在上面的这个示例中，有五个颜色，那么它们的位置分别在0%、25%、50%、75%和100%。它们将沿着渐变线平均分布渐变颜色。


🆗，现在我们回到绘制三角形。

首先我们可以用一个linear-gradient绘制这样一个图，将其分成两个三角.
![image](https://user-images.githubusercontent.com/72189350/211197270-149a00ba-612d-4397-93a5-64de26b286a4.png)

```
<div class='normal'></div>

div {
  width: 100px;
  height: 100px;
  margin: auto;
}

.normal {
  background: linear-gradient(45deg, deeppink 50%, yellowgreen 50%); // 设置为45度，两个颜色平分。
}
```

那么接下来我们只需要把其中一半给设置为`transparent`即可,同时我们可以借助`transform: rotate()`设置摆放方向
![image](https://user-images.githubusercontent.com/72189350/211197361-31cb511c-c71f-436c-a710-0d405c3589ce.png)

```
<div class='rotate'></div>
<div class='top'></div>
<div class='bottom'></div>
<div class='left'></div>
<div class='right'></div>

div {
  width: 100px;
  height: 100px;
  margin: auto;
}

.rotate {
  background: linear-gradient(45deg, deeppink 50%, transparent 50%);
}

.top {
  background: linear-gradient(45deg, deeppink 50%, transparent 50%);
  transform: rotate(135deg);
}

.left {
  background: linear-gradient(45deg, deeppink 50%, transparent 50%);
  transform: rotate(45deg);
}

.bottom {
  background: linear-gradient(45deg, deeppink, deeppink 50%, transparent 50%, transparent 1px);
  transform: rotate(-45deg);
}

.right {
  background: linear-gradient(45deg, deeppink 50%, transparent 50%);
  transform: rotate(-135deg);
}
```

## transform: rotate 配合 overflow: hidden 绘制三角形

利用transform: rotate() 旋转一个盒子，在把旋转出边界的部分隐藏，构成三角形。

![image](https://user-images.githubusercontent.com/72189350/211197584-a471ed1a-7a6e-43c1-bb3a-9eb0eb4c057a.png)

```
<div class="block"></div>

.block {
    display: inline-block;
    height: 100px;
    width: 141px;
    position: relative;
    overflow: hidden;
}

.block::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: deeppink; 
    /* 旋转原点在左下，旋转45度 */
    transform-origin: left bottom;
    transform: rotate(45deg);
}
```
