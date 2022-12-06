function MVVM(opitons = {}) {
    this.$options = opitons  // 将所有属性挂载在$options
    // this._data
    var data = this._data = this.$options.data

    // 1.数据劫持
    observe(data); // 观察对象给对象增加Object.DefineProperty

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

    // 7.计算属性实现
    initComputed.call(this);

    //3.编译模板
    new Compile(opitons.el,this);  // 传入#app，data
}

function initComputed() {  // 具有缓存功能
    let vm = this;
    let computed = this.$options.computed; // Object.keys({name:1,age:2}) => [name,age]
    Object.keys(computed).forEach(key => {
        console.log(key,computed[key])
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
            if (node.nodeType === 3 && reg.test(text)) {  // 既是文本结点且有{{}}匹配
                let arr = RegExp.$1.split('.'); // [a.a]
                let val = vm;      // this
                arr.forEach(k => {
                    val = val[k]   
                });

                new Watcher(vm,RegExp.$1,function(newval) {
                    // 把DOM中变量编译成数值，更换DOM中正则匹配{{}}中的数据 
                    node.textContent = text.replace(/\{\{(.*)\}\}/,newval);
                })
                // 把DOM中变量编译成数值，更换DOM中正则匹配{{}}中的数据 
                node.textContent = text.replace(/\{\{(.*)\}\}/,val);
            }

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
                Dep.target && dep.addSub(Dep.target);
                return val;
            },
            set(newval) { // 更改值
                if (newval === val) return;
                val = newval;
                observe(newval)
                dep.notify();   //让所有的watch执行update
            },
        })
    }
}

function observe(data) {
    if (typeof data  !== 'object') return;
    return new Observe(data)
}

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

// Watch是一个类，通过这个类创建的实例都加上update方法
function Watcher(vm,exp,fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;
    let val = vm;
    let arr = exp.split('.');
    arr.forEach(x => {
        val = val[x];
    })
    Dep.target = null
}

Watcher.prototype.update = function() {
    let val = this.vm;
    let arr = this.exp.split('.');
    arr.forEach(x => {
        val = val[x];
    })
    this.fn(val); 
}
