# 响应式和双向绑定

## 什么是响应式（MVVM）？

响应式就是数据发生改变后，会通知使用到该数据的代码，让其视图也自动更新。

## Object.definePropty的了解？

`Object.definePropty` 是用来定义一个对象属性。

有三个参数。
- 第一个实例对象，作为属性的载体
- 第二个传入属性名
- 第三个传入一个对象，来定义这个属性名的其它属性。如：get，set，value，可枚举，可修改等。。

```Javascript
Object.defineProperty(data,key, {
    enumerable:true,
    get() {
        return val;
    },
    set(newval) { // 更改值
        if (newval === val) return;
        val = newval;
    },
})
```

## vue的响应式原理？

vue的响应式原理是利用**数据劫持+发布订阅的模式**来实现的。

1.在vue中拿到数据后，会先对数据进行一个数据劫持，就是给对象中的数据都利用`Object.defineProperty`在挂载上get/set 属性，具体就是用`observe`去递归搜索对象。挂载上
get/set，就可以利用发布订阅用`watcher`去收起依赖。

2.接着用一个`Dep`负责数据依赖的收集，其实就是用一个数组来实现发布订阅的模式，上游对接`Observer`，下游对接`Watcher`。

3.`Watcher`其实一个类，用来给数据对象附上一些属性和方法。

总结整个流程：首先data闯入`observer`用数据劫持转成get/set形式，当在`Watcher`触发get,将其收集到事件池`Dep`中。而当数据更新时，会触发set，就会在`Dep`事件池中通知的所
有`Watcher`去更新。


## 手写一个MVVM试试？
首先我们定义好框架
```Javascript
function MVVM(opitons = {}) {
    this.$options = opitons  // 将所有属性挂载在$options
    // this._data
    var data = this._data = this.$options.data
}
```
### 数据劫持
第一步是数据劫持，首先我们会用`observe`去搜索data中的所有数据，给他附上一个get/set。
```Javascript
function MVVM(opitons = {}) {
    this.$options = opitons  // 将所有属性挂载在$options
    // this._data
    var data = this._data = this.$options.data
    
    // 1.数据劫持
    observe(data); // 观察对象给对象增加Object.DefineProperty
}

function Observe(data) {
    for (let key in data) { 
        // 将data中的数据，通过Object.definepropery定义属性
        let val = data[key];
        observe(val);
        Object.defineProperty(data,key, {
            enumerable:true,
            get() {
                return val;
            },
            set(newval) { // 更改值
                if (newval === val) return;
                val = newval;
                observe(newval)  // 对新的数据进行搜索，防止数据是一个对象
            },
        })
    }
}

function observe(data) {
    if (typeof data  !== 'object') return;
    return new Observe(data)
}
```

此时我们把基础的数据劫持做完了，这时候已经为数据都挂上get/set。

### 数据代理

数据代理，其实对MVVM不是主要影响。他只是简化我们获取数据的操作，比如在代理之前，我们获取数据是这样 `this._data.name`,当我们进行数据代理后，就可以直接`this.name`。也就是可以少写几个单词。

在MVVM中操作即可，直接用this来代理this._data
```Javascript
function MVVM(opitons = {}) {
    ...
    // 2.数据代理 this 代理了this._data
    for (let key in data) {
        Object.defineProperty(this,key,{
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newval) {
                this._data[key] = newval
            },
        })
    }
}
```

### 编译模板

编译模板，就是我们要获取到DOM上的结点，然后给DOM结点上的变量更新数据。我们在vue中使用{{}}的方法编译响应式变量的，编译模板就是处理这类问题。把响应式的数据编译到DOM上。

这里我们首先要把DOM结点取得弄到内存中，我们首先创建一个文档片段fragment，然后把DOM中全部塞到fragment，在通过正则匹配找到{{}},把数据渲染上去。
```Javascript
function Compile(el,vm) {     // 这里的el是传入#app，vm是取得MVVM中的data
    // 获取DOM，并把DOM用文档碎片方式，移动到内存中操作
    vm.$el = document.querySelector(el);
    let fragment = document.createDocumentFragment();  // 创建文档片段
    // 将DOM塞进文档片段中
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child);
    }
    replace(fragment)
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(node => { //循环每一层
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;    // 正则表达式 用来找出DOM中的{{}}
            if (node.nodeType === 3 && reg.test(text)) {  // 既是文本结点且有{{}}匹配
                let arr = RegExp.$1.split('.'); // [a.a]
                let val = vm;      // this
                arr.forEach(k => {
                    val = val[k]   
                });
                // 把DOM中变量编译成数值，更换DOM中正则匹配{{}}中的数据 
                node.textContent = text.replace(/\{\{(.*)\}\}/,val);
            }
            if (node.childNodes) {
                replace(node);
            }
        })
    }
    vm.$el.appendChild(fragment);
}
```
### 发布订阅

ok，到这里为止。我们就已经能对变量数据进行更新修改的了，但是我们此时还是无法响应式更新数据。

这个就要用到发布订阅了。

对于发布订阅，我们需要实现两个东西，一个是Dep事件池，一个是Watcher。

Dep是用来对接 Observer 和 Watcher。

Watcher是给数据挂载上一些方法，让其数据在set过程可以响应式修改数据。

下面是发布订阅的基本框架，可以发现结构还是很简单的。

这里实现了addSub是用来添加事件的，notify是用来统一更新的，Watchers只有一个update，就是来更新数据的。
```Javascript
// 4、发布订阅模式

//绑定的方法 都有一个update属性
function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function (sub) { // 订阅
    this.subs.push(sub);
}

Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update());
}

function Watcher(fn) { // Watch是一个类，通过这个类创建的实例都加上update方法
    this.fn = fn;
}

Watcher.prototype.update = function() {
    this.fn()
}

let watcher = new Watcher(function () {
    alert(1)
})

let dep = new Dep();
dep.aadSub(watcher);     //将watcher放进数组中
dep.notify();
```

下面我们结合上面的MVVM，来补全发布订阅。其实Dep已经实现完全了，现在只需要完善Watcher。

那首先我们想想应该怎么订阅事件，Watcher是在数据更新后，把数据渲染到DOM上。因此我们需要在编译模板时，就订阅事件。
```Javascript
function Compile(el,vm) {     // 这里的el是传入#app，vm是取得MVVM中的data
    ...
    replace(fragment)
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(node => { //循环每一层
            ...
            if (node.nodeType === 3 && reg.test(text)) {  // 既是文本结点且有{{}}匹配
                ...
                new Watcher(vm,RegExp.$1,function(newval) {
                    // 把DOM中变量编译成数值，更换DOM中正则匹配{{}}中的数据 
                    node.textContent = text.replace(/\{\{(.*)\}\}/,newval);
                })
                ...
            }
        })
    }
}
```

我们要的效果是，数据在set可以修改数据，并且通知事件池的事件都更新修改的数据。因此我们其实在get的时候，就需要先提前把事件push到事件池中。

我们只需要再定义的时候push，其它时候调用get不需要加入事件，因此我们可以先把Watcher进行标记

这里是一个比较巧妙的一点，我们直接再Dep上挂载一个Watcher即可，然后在调用get的时候，再把Watcher加入到事件池，最后把Dep上的Watcher赋空。
```Javascript
function Watcher(vm,exp,fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;   // 标记一下
    let val = vm;
    let arr = exp.split('.');
    arr.forEach(x => {
        val = val[x];   // 获取数据，调用了get
    })
    Dep.target = null   // 清空现场
}

function Observe(data) {
    // 4、发布订阅
    let dep = new Dep();
    for (let key in data) { 
        // 将data中的数据，通过Object.definepropery定义属性
        let val = data[key];
        observe(val);
        Object.defineProperty(data,key, {
            enumerable:true,
            get() {
                Dep.target && dep.addSub(Dep.target);   //如果被标记过，把Watcher加到事件池
                return val;
            },
            set(newval) { // 更改值
                if (newval === val) return;
                val = newval;
                observe(newval) 
                dep.notify();   //发现修改，让所有的watch执行update           
            },
        })
    }
}

Watcher.prototype.update = function() {
    let val = this.vm;
    let arr = this.exp.split('.');
    arr.forEach(x => {
        val = val[x];
    })
    this.fn(val); 
}
```

到此为止，响应式原理就全部结束了，后面是对一些其它功能的补充。

### 双向绑定

双向绑定也是借助响应式原理实现的，因此在这里我们可以顺便实现一下双向绑定。

再vue中无非就是有一个Api，v-model。我们的实现逻辑也和编译模板时的{{}} 类似,因此直接编译模板再判断一下v-model即可。

```Javascript
function Compile(el,vm) {
    // 获取DOM，并把DOM用文档碎片方式，移动到内存中操作
    vm.$el = document.querySelector(el);
    let fragment = document.createDocumentFragment();  // 创建文档片段
    // 将DOM塞进文档片段中
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child);
    }
    replace(fragment)
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(node => { //循环每一层
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;
            
            ...
            
            //5. 双向数据绑定实现
            if (node.nodeType === 1) {   // 如果是元素结点
                let nodeAttrs = node.attributes;  // 获取当前DOM节点的属性
                Array.from(nodeAttrs).forEach(attr => {
                    let name = attr.name;   // type="text"
                    let exp = attr.value;  // v-model="b"
                    if (name.indexOf('v-') == 0) {  // v-model
                        node.value = vm[exp];
                    }
                    
                    // 订阅事件 当watcher触发时，会自动将内容放进输入框
                    new Watcher(vm,exp,function(newval){
                        node.value = newval;
                    });
                    
                    node.addEventListener('input',function(e) {
                        let newval = e.target.value;
                        vm[exp] = newval;
                    })
                })
            }

            if (node.childNodes) {
                replace(node);
            }
        })
    }
    vm.$el.appendChild(fragment);
}
```

### Computed

vue的Computed有一个很重要的作用就是可以缓存数据。根据依赖关系进行计算并缓存, 只有当依赖被改变的时候才会更新数据。

缓存的好处就是，当我们求得一个结果的值后，如果在下次又调用了这个值，这时候在内存中就直接去之前的值，而不会重新在计算。

实现逻辑也很容易，在这里我们已经不需要设置set，只需要get获取数据即可。

因此我们直接把computed中的函数全都取出来，然后遍历一遍这些函数即可，如果是函数的话就直接调用，如果是对象就调用对象的get。
```Javascript
function initComputed() {  // 实现缓存功能
    let vm = this;
    let computed = this.$options.computed; // 获取computed中的对象/函数
    Object.keys(computed).forEach(key => {
        Object.defineProperty(vm,key,{   //computed[key]
            get:typeof computed[key] === 'function' ? computed[key] : computed[key].get,
            // get() {
            //     return typeof computed[key] === 'function' ? computed[key] : computed[key].get
            // },
            set() { 
            },
        })
    })
}
```

## 单向数据流和双向绑定？

vue是单向数据流，所谓的双向绑定其实就是v-on和v-bind结合起来的语法糖。
```Javascript
<input v-model="value" />
<input v-bind:value="value" v-on:input="value= $event.target.value" />
```

## 补充
[MVVM源码链接](https://github.com/leoyongyuan/Daily-Power/tree/main/Vue/MVVM)
