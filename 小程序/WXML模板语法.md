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

<block> 并不是组件，只是一个包裹性的容器，不会在页面渲染。
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
