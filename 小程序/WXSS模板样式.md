# WXSS模板样式

## rpx尺寸单位

rpx 可以解决屏适配的尺寸单位。

实现原理：将所有的屏幕宽度等分成750份，也就是750rpx，小程序就会把rpx单位换算成对饮的像素单位。

在iphone6，屏幕宽度为375px，共有750物理像素，等分750rpx。
- 750rpx = 375px = 750物理像素
- 1rpx = 0.5px = 1 物理像素

# 样式导入

Wxss提供的@import

```CSS
@import "/common/common.wxss";
```
