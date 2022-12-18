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

## Promise包安装

**安装** `npm i --save miniprogram-api-promise`

**配置**
```Javascript
// app.js
import { promisifyAll } from 'miniprogram-api-promise'

const wxp = wx.p = {}

promisifyAll(wx,wxp)
```

**使用**
```Javascript
<button bindtap="getInfo">按钮</button>

async getInfo() {
  const res = await wx.p.request({
    methods: 'GET',
    url: 'https://www.escook.cn/api/get',
    data: {
      name: 'lyy',
      age: 18,
    }
  })
  console.log(res)
},
```

## 全局数据共享
类似vue中的vuex，react中的redux。

**安装 **
- `npm install --save mobx-miniprogram@4.13.2`创建store实例对象
- `npm install --save mobx-miniprogram-bindings@1.2.1`把store中的共享数据取出来，绑定到组件中

**配置**
在整个项目中需要创建一个store文件夹，并且创建store.js文件。
```Javascript
// store.js
import { observable, action } from 'mobx-miniprogram'

export const store = observable({
  // 数据字段
  numa: 1,
  numb: 2,
  // 计算属性
  get add() {  // 需要在方法面前加get关键字
    return this.numa + this.numb;
  },

  // actions 方法，用来修改store的数据
  updateNuma: action(function(step) {
    this.numa += step
  }),

  updateNumb: action(function(step) {
    this.numb += step
  }),
})
```

**使用**
```Javascript
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'

Page({
  ...
  // 事件处理函数
  onLoad(options) {
    this.storeBindings = createStoreBindings(this,
    {
      store,
      fields: ['numa','numb','add'],
      actions: ['updateNuma','updateNumb']
    })
  },
  onUnload() {
    this.storeBindings.detroyStoreBindings()
  },
  addNuma(e) {
    this.updateNuma(e.target.dataset.step)
  },
  addNumb(e) {
    this.updateNumb(e.target.dataset.step)
  },
})


// wxml
<view>{{numa}} + {{numb}} = {{add}}</view>
<button bindtap="addNuma" data-step="{{1}}">numa + 1</button>
<button bindtap="addNumb" data-step="{{1}}">numb + 1</button>
```
