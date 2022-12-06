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
