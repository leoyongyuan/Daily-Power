# 路由守卫

## 什么是路由守卫？

路由守卫就是vue在进行路由跳转的时候，vue给我们的提供一些钩子进行操作。

就类似一个保安一样，当我们要进入一个路由时，要先经过这个保安的检查。

## 有几种路由守卫？

有三种路由守卫：

- 全局路由守卫：就是所有的路由组件都可以触发。
- 独享路由守卫：在特定的某个路由上设置。
- 组件路由守卫：在组件内，设置路由钩子函数。

钩子函数的三个参数：

- to：即将要进入的路由对象
- form：即将要离开的路由对象
- next：next是用来放行路由通过，如果没有next(),就会中断路由，不会继续往下执行。

## 说说路由守卫的钩子函数？

1.全局路由守卫：
- `beforeEach(to,form,next)`： 在路由跳转前触发
- `beforeResolve(to,form,next)`：也是在路由跳转前触发，区别在于执行顺序，在所有组件内守卫解析之后才执行。也即是在`beforeEach` 和 `beforeRouteEnter` 之前，在`afterEach`之后
- `afterEach(to,form)`：在路由跳转后触发

```Javascript
router.beforeEach((to,from,next) => {
    if (to.meta.isAuth) {
        if (localStorage.getItem('name') === 'lyy') {
            console.log("进入成功")
            next()
        } else {
            console.log("进入失败")
        }
    } else {
        next()
    }
})
// 全局后置路由守卫
router.afterEach((to) => {
    document.title = to.name
})
```

2.独享路由守卫

在单个路由中定义，`beforeEnter`进入改路由时触发。

```Javascript
{
    path:'/Ace',
    name: 'Ace',
    component: Ace,
    meta: {
        isAuth: true,
    },
    // 独享路由守卫,用来给一个路由单独配置
    beforeEnter: (to,from,next) => {
        if (to.meta.isAuth) {
            if (localStorage.getItem('name') === 'lyy') {
                console.log("进入成功")
                next()
            } else {
                console.log("进入失败")
            }
        } else {
            next()
        }
    },
},
```

3.组件内路由守卫

在组件中配置的路由守卫

- `beforeRouteEnter` 进入组件时触发
- `beforeRouteLeave` 离开组件时触发

```Javascript
export default {
    name: 'VHome',
    
    // 组件内路由守卫——进入,进入时调用
    beforeRouteEnter (to,from,next) {
        console.log(to,from)
        alert("进入HOME")
        next()
    },


    // 组件内路由守卫——离开，离开时调用
    beforeRouteLeave (to,from,next) {
        console.log(to,from)
        alert("离开HOME")
        next()
    }
}
```

## 路由的实现原理？

1.hash模式实现

hash模式最常见的就是url中携带着#，在#后面就是一个url的组成部分，其实现原理是浏览器内部暴露了一个`hashchange`的方法，在hash改变时触发该事件，渲染不同的组件。
```Javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
      name="viewport"
    />
    <title>实现简单的hash路由</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        height: 100%;
      }
      #content {
        height: calc(100vh - 50px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
      }
      #nav {
        height: 50px;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        display: flex;
      }
      #nav a {
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
      }
      #nav a:not(:last-of-type) {
        border-right: none;
      }
    </style>
  </head>
  <body>
    <main id="content"></main>
    <nav id="nav">
      <a href="#/">首页</a>
      <a href="#/shop">商城</a>
      <a href="#/shopping-cart">购物车</a>
      <a href="#/mine">我的</a>
    </nav>
  </body>
  <script>
    class VueRouter {
      constructor(routes = []) {
        this.routes = routes; // 路由映射
        this.currentHash = ""; // 当前的hash
        this.refresh = this.refresh.bind(this);
        window.addEventListener("load", this.refresh, false);
        window.addEventListener("hashchange", this.refresh, false);
      }

      getUrlPath(url) {
        // 获取hash
        return url.indexOf("#") >= 0 ? url.slice(url.indexOf("#") + 1) : "/";
      }

      refresh(event) {
        // URL hash发生改变的时候，拿到当前的hash
        let newHash = "",
          oldHash = null;
        if (event.newURL) {
          oldHash = this.getUrlPath(event.oldURL || "");
          newHash = this.getUrlPath(event.newURL || "");
        } else {
          newHash = this.getUrlPath(window.location.hash);
        }
        this.currentHash = newHash;
        this.matchComponent();
      }

      matchComponent() {
        let curRoute = this.routes.find(
          (route) => route.path === this.currentHash
        );
        if (!curRoute) {
          // 当前URL中的hash不存在的时候，默认取第一个，当然真实场景下，可能会有各种情况，取决于业务逻辑
          curRoute = this.routes.find((route) => route.path === "/");
        }
        const { component } = curRoute;
        document.querySelector("#content").innerHTML = component;
      }
    }

    const router = new VueRouter([
      {
        path: "/",
        name: "home",
        component: "<div>首页内容</div>"
      },
      {
        path: "/shop",
        name: "shop",
        component: "<div>商城内容</div>"
      },
      {
        path: "/shopping-cart",
        name: "shopping-cart",
        component: "<div>购物车内容</div>"
      },
      {
        path: "/mine",
        name: "mine",
        component: "<div>我的内容</div>"
      }
    ]);
  </script>
</html>
```

2.history模式
histoty模式的实现，是依赖于一个全局对象history，这个对象包含了关于访问网页的信息。

history模式就是利用对象中的pushState和replaceState实现的。

- window.history.pushState 可以将给定的数据压入到浏览器会话历史栈中
- window.history.replaceState 将当前的会话页面的url替换成指定的数据

```Javascript
<!DOCTYPE html>
<html lang=" en">
    <head>
        <meta charset="UTF-8" />
        <meta http- equiv=" X-UA-Compat ible" content=" IE=edge" />
        <meta name= "viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <div id="div"></div>
        <button id="button1">首页</button>
        <button id="button2">商城</button>
        <button id="button3">购物车</button>
        <button id="button4">我的</button>
    </body>
    <script>
        const button1 = document.querySelector('#button1')
        const button2 = document.querySelector('#button2')
        const button3 = document.querySelector('#button3')
        const button4 = document.querySelector('#button4')

        let _wr = function (type) {
            let orig = history[type]
            return function () {
               let rv = orig.apply(this,arguments)
               let e = new Event(type)
               e.arguments = arguments
               window.dispatchEvent(e)
               return rv
            }
        }
        
        history.pushState = _wr('pushState')
        history.replaceState = _wr('replaceState')
        
        button1.addEventListener('click',() => {
            history.pushState( { state: 1 }, null, './home' )
        })
        button2.addEventListener('click',() => {
            history.pushState( { state: 2 }, null, './shop' )
        })
        button3.addEventListener('click',() => {
            history.pushState( { state: 3 }, null, './shopping-cart' )
        })
        button4.addEventListener('click',() => {
            history.pushState( { state: 4 }, null, './mine' )
        })

        window.addEventListener('pushState',e => {
            console.log(...e.arguments)
        })
    </script>
</html>
```

3.区别：hash模式不需要后端配合，是纯前端，但是url中包含着#。history需要后端配合，因为在history模式下，浏览器会把地址当成一个静态资源路径，如果服务端没有该资源则会报错。



