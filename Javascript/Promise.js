class Promise {
    constructor(executor) {
        this.state = 'pending'
        this.result = null
        this.callback = [];

        const _this = this;

        function resolve(data) {
            if (_this.state !== 'pending') return ;
            _this.state = 'fulfilled';
            _this.result = data;


            setTimeout(() =>{
                _this.callback.forEach(item => {
                    item.onResovled(data)
                })      
            })
        }

        function reject(data) {
            if (_this.state !== 'pending') return ;
            _this.state = 'rejected';
            _this.result = data;
            
            setTimeout(() =>{
                _this.callback.forEach(item => {  // 处理多个回调
                    item.onRejected(data)
                })      
            })
        }

        try{           // 处理抛出错误
            executor(resolve,reject);
        }catch(e) {
            reject(e);
        }
    }

    then(onResovled,onRejected) {
        const _this = this;
    
        // 判断回调函数是否存在 允许使用then的时候不写一些参数
    
        if (typeof onRejected !== 'function') {
            onRejected = err => {
                throw err;
            }
        }
    
        if (typeof onResovled !== 'function') {
            onResovled = value => value;
        }
    
        return new Promise((resolve,reject) => {  // 返回值为Promise
            function callback(fn) {
                try{
                    const res = fn(_this.result);
                    // 判断返回值是否为Promise
                    if (res instanceof Promise) {
                        res.then(x => {
                            resolve(x);
                        },err => {
                            reject(err);
                        })
                    } else {    // 如果不是Promise返回函数中的返回值
                        // 返回Promise成功状态和返回值。
                        resolve(res);  
                    }
                } catch(e) {
                    reject(e)
                }
            }
    
            if (this.state === 'fulfilled') {
                // 获取函数的返回值
                setTimeout(() =>{
                    callback(onResovled)
                })
            }
        
            if (this.state === 'rejected') {
                setTimeout(() =>{
                    callback(onRejected);  
                })
            }
        
            // 处理异步情况
            if (this.state === 'pending') {
                this.callback.push({
                    onResovled: function() {
                        callback(onResovled);
                    },
                    onRejected: function() {
                        callback(onRejected);
                    }
                })
            }
        })
    }
    
    catch(onRejected) {
        return this.then(undefined,onRejected);
    }

    // 表明resolve不属于实例对象，只属于类
    static resolve(value) {
        return new Promise((resolve,reject) => {
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v)
                },err => {
                    reject(err);
                })
            } else {
                resolve(value);
            }
        })
    }
    
    static reject(value) {
        return new Promise((resolve,reject) => {
            reject(value);
        })
    }
    
    
    static all(promises) {
        // 返回结果为Promise
        let cnt = 0,n = promises.length;
        let arr = new Array(n);
        return new Promise((resolve,reject) => {
            for (let i = 0; i < n; i ++ ) {
                promises[i].then(v => {
                    cnt ++;
                    // 不能用push，可能存在异步任务，导致返回结果顺序不一致
                    arr[i] = v; 
                    if (cnt === n) {
                        resolve(arr);
                    }
                },err => {
                    reject(err);
                })
            }
        })
    }
    
    static race(promises) {
        const n = promises.length;
        return new Promise((resolve,reject) => {
            for (let i = 0; i < n; i ++ ) {
                promises[i].then(v => {
                    resolve(v);
                },err => {
                    reject(err);
                })
            }
        })
    }
}


// 对象继承版本
// function Promise(executor) {
//     this.state = 'pending'
//     this.result = null
//     this.callback = [];

//     const _this = this;

//     function resolve(data) {
//         if (_this.state !== 'pending') return ;
//         _this.state = 'fulfilled';
//         _this.result = data;


//         // 异步情况
//         setTimeout(() =>{
//             _this.callback.forEach(item => {
//                 item.onResovled(data)
//             })      
//         })
//     }

//     function reject(data) {
//         if (_this.state !== 'pending') return ;
//         _this.state = 'rejected';
//         _this.result = data;
        
//         // 异步情况
//         setTimeout(() =>{
//             _this.callback.forEach(item => {  // 处理多个回调
//                 item.onRejected(data)
//             })      
//         })
//     }

//     try{           // 处理抛出错误
//         executor(resolve,reject);
//     }catch(e) {
//         reject(e);
//     }
// }

// Promise.prototype.then = function(onResovled,onRejected) {
//     const _this = this;

//     // 判断回调函数是否存在 允许使用then的时候不写一些参数

//     if (typeof onRejected !== 'function') {
//         onRejected = err => {
//             throw err;
//         }
//     }

//     if (typeof onResovled !== 'function') {
//         onResovled = value => value;
//     }

//     return new Promise((resolve,reject) => {  // 返回值为Promise
//         function callback(fn) {
//             try{
//                 const res = fn(_this.result);
//                 // 判断返回值是否为Promise
//                 if (res instanceof Promise) {
//                     res.then(x => {
//                         resolve(x);
//                     },err => {
//                         reject(err);
//                     })
//                 } else {    // 如果不是Promise返回函数中的返回值
//                     // 返回Promise成功状态和返回值。
//                     resolve(res);  
//                 }
//             } catch(e) {
//                 reject(e)
//             }
//         }

//         if (this.state === 'fulfilled') {
//             // 获取函数的返回值
//             setTimeout(() =>{
//                 callback(onResovled)
//             })
//         }
    
//         if (this.state === 'rejected') {
//             setTimeout(() =>{
//                 callback(onRejected);  
//             })
//         }
    
//         // 处理异步情况
//         if (this.state === 'pending') {
//             this.callback.push({
//                 onResovled: function() {
//                     callback(onResovled);
//                 },
//                 onRejected: function() {
//                     callback(onRejected);
//                 }
//             })
//         }
//     })
// }

// Promise.prototype.catch = function(onRejected) {
//     return this.then(undefined,onRejected);
// }  

// Promise.resolve = function(value) {
//     return new Promise((resolve,reject) => {
//         if (value instanceof Promise) {
//             value.then(v => {
//                 resolve(v)
//             },err => {
//                 reject(err);
//             })
//         } else {
//             resolve(value);
//         }
//     })
// }

// Promise.reject = function(value) {
//     return new Promise((resolve,reject) => {
//         reject(value);
//     })
// }


// Promise.all = function(promises) {
//     // 返回结果为Promise
//     let cnt = 0,n = promises.length;
//     let arr = new Array(n);
//     return new Promise((resolve,reject) => {
//         for (let i = 0; i < n; i ++ ) {
//             promises[i].then(v => {
//                 cnt ++;
//                 // 不能用push，可能存在异步任务，导致返回结果顺序不一致
//                 arr[i] = v; 
//                 if (cnt === n) {
//                     resolve(arr);
//                 }
//             },err => {
//                 reject(err);
//             })
//         }
//     })
// }

// Promise.race = function(promises) {
//     const n = promises.length;
//     return new Promise((resolve,reject) => {
//         for (let i = 0; i < n; i ++ ) {
//             promises[i].then(v => {
//                 resolve(v);
//             },err => {
//                 reject(err);
//             })
//         }
//     })
// }

