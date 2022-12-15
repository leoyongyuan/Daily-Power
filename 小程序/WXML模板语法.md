# WXML模板语法

## 条件模板

```HTML
<view wx:if="{{type == 'man'}}">man</view>
<view wx:elif="{{type=='woman'}}">woman</view>
<view wx:else>none</view>

data: {
  type:'woman',
}    
```

借助block包裹标签显示隐藏。

block并不是组件，只是一个包裹性的容器，不会在页面渲染。
```HTML
<block wx:if="{{true}}">
  <view>1</view>
  <view>2</view>
</block>
```
![image](https://user-images.githubusercontent.com/72189350/207796063-75cc58ae-8347-4cce-8244-49d9e5f0c853.png)
  
不用block,会渲染view
```HTML
<view wx:if="{{true}}">
  <view>1</view>
  <view>2</view>
</view>
``` 
![image](https://user-images.githubusercontent.com/72189350/207796315-7950bd71-346e-414f-a279-adbe11196fba.png)

## hidden

与vue中的v-show一致。

hidden只是增加or隐藏样式而已，wx:if 动态创建or移除元素
```HTML
<view hidden="{{flag}}">条件为true时隐藏</view>
<view hidden="{{!flag}}">条件为true时隐藏</view>
```

## 循环渲染
和v-for类似，wx:for="{{array}}".

```HTML
data: {
  arr:[1,2,3,4,5,6,7],
},
<view wx:for="{{arr}}">
  索引是:{{index}},item项是:{{item}}
</view>

// 循环字符串
<view wx:for="arr">
  索引是:{{index}},item项是:{{item}}
</view>
```

手动指定索引和获取当前项的变量名
wx:for-index wx:for-item
```HTML
<view wx:for="{{arr}}" wx:for-index="idx" wx:for-item="itemName">
  索引是:{{idx}},item项是:{{itemName}}
</view>
```

### key值
和vue中的key一样，用来优化diff算法,wx:key
```HTML
<view wx:for="{{arr}}" wx:key="index">
  索引是:{{index}},item项是:{{item}}
</view>
```
