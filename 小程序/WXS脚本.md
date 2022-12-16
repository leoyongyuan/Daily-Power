# WXS脚本

wxs是小程序独有的一套脚本语言，用来结合WXML，构建页面,wxs类似ES5的Javascript代码，不支持ES6以上版本


## 内嵌wsx脚本

必须提供module属性，指定为wxs的模块名称。
```
data: {
  username: 'lyy'
},

<text>{{m1.toUpper(username)}}</text>

<wxs module="m1">
  module.exports.toUpper = function(str) {
    return str.toUpperCase()
  }
</wxs>
```

## 外联wxs脚本

```
// .wxs 文件

function toLower(str) {
  return str.toLowerCase()
}

module.exports = {
  toLower: toLower,
}

// 使用

<text>{{m2.toLower(country)}}</text>
<wxs src="../../utils/tools.wxs" module="m2"></wxs>
```
