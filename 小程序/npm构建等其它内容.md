# 补充

## npm 使用

右键点击小程序文件夹列表，选择在外部终端窗口打开即可,运行npm命令即可。

![image](https://user-images.githubusercontent.com/72189350/208284067-391d4107-ae62-43cf-9cf5-bab329d396a7.png)

在小程序中点击工具，运行构建npm，就可以把外部的包内容引进。
![image](https://user-images.githubusercontent.com/72189350/208284053-2ffa0c59-4846-4dd1-b873-ebd66737a30d.png)


## vant主题颜色修改

[css变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties),通过定义变量比如`--main-color: black;`,在变量前加上`--`，用var()来调用变量。

```css
// 定义
element {
  --main-bg-color: brown;
}

// 使用
element {
  background-color: var(--main-bg-color);
}
```

vant主题颜色修改，[参考vant的主题](https://youzan.github.io/vant-weapp/#/theme),vant主题中就是用css变量设置样式。

在小程序中修改,在app.wxss中,变量名参考[配置文件](https://github.com/youzan/vant-weapp/blob/dev/packages/common/style/var.less)，注意less是用`@`，css是用`--`
```
page {
  --button-danger-background-color: #C00000;
  --btton-danger-border-color: #D60000;
}
```
