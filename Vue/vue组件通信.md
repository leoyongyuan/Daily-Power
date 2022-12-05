# 组件通信

## 1.父子组props/$emit

父组件通过`props`的方式传递参数，而子组件通过`$emit`向父组件传递数据。

`props`只可以从上级传到下级，即所谓的单向数据流，只可读取不可修改，所有修改都会受到警告。

1.父传子
```Javascript
// 父组件
<template>
  <div class="section">
    <com-article :articles="articleList"></com-article>
  </div>
</template>

<script>
import comArticle from './test/article.vue'
export default {
  name: 'HelloWorld',
  components: { comArticle },
  data() {
    return {
      articleList: ['红楼梦', '西游记', '三国演义']
    }
  }
}
</script>

// 子组件 
<template>
  <div>
    <span v-for="(item, index) in articles" :key="index">{{item}}</span>
  </div>
</template>

<script>
export default {
  props: ['articles']
}
</script>
```

2.子传父
`$emit`绑定一个自定义事件，当这个事件被执行时，就会通过参数传递给父组件，父组件通过`v-on`监听获取。
```Javascript
// 父组件中
<template>
  <div class="section">
    <com-article :articles="articleList" @onEmitIndex="onEmitIndex"></com-article>
    <p>{{currentIndex}}</p>
  </div>
</template>

<script>
import comArticle from './test/article.vue'
export default {
  name: 'HelloWorld',
  components: { comArticle },
  data() {
    return {
      currentIndex: -1,
      articleList: ['红楼梦', '西游记', '三国演义']
    }
  },
  methods: {
    onEmitIndex(idx) {
      this.currentIndex = idx
    }
  }
}
</script>

// 子组件
<template>
  <div>
    <div v-for="(item, index) in articles" :key="index" @click="emitIndex(index)">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: ['articles'],
  methods: {
    emitIndex(index) {
      this.$emit('onEmitIndex', index)
    }
  }
}
</script>
```

## 父子组$parent/$children($refs)

通过`$parent`和`$children`的方式访问组件实例，拿到实例就可以访问组件中的所有方法和数据。(在vue3中，已经删除了`$children`改用`$refs`)
```Javascript
// 子组件中 $parent使用
<template>
  <div class="com_a">
    <span>{{messageA}}</span>
    <p>获取父组件的值为:  {{parentVal}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageA: 'this is old'
    }
  },
  computed:{
    parentVal(){
      return this.$parent.msg;
    }
  }
}
</script>

// 父组件中 $children
<template>
  <div class="hello_world">
    <div>{{msg}}</div>
    <com-a></com-a>
    <button @click="changeA">点击改变子组件值</button>
  </div>
</template>

<script>
import ComA from './test/comA.vue'
export default {
  name: 'HelloWorld',
  components: { ComA },
  data() {
    return {
      msg: 'Welcome'
    }
  },

  methods: {
    changeA() {
      // 获取到子组件A
      this.$children[0].messageA = 'this is new value'
    }
  }
}
</script>
```
`ref`:如果在DOM元素上使用`ref`，引用指向的就是DOM元素。如果在组件上，引用的就是组件实例。
```Javascript
// 父组件 $refs使用

<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted () {
      const comA = this.$refs.comA;
      console.log(comA.name);  // Vue.js
      comA.sayHello();  // hello
    }
  }
</script>
```

## 3.依赖注入 provide/inject

其实就是父组件的变量数据通过`provide`注入给子组件，子组件利用`inject`接收变量。（这组的数据通信不是响应式的）
```
// A组件
<template>
  <div>
    <VcomB></VcomB>
  </div>
</template>
<script>
import VcomB from '@/components/test/VcomB.vue'
  export default {
    name: "VcomA",
    provide: {
      for: "demo"
    },
    components:{
      VcomB
    },
  }
</script>

// B组件
<template>
    <div>
      {{demo}}
      <VcomC></VcomC>
    </div>
</template>
<script>
import VcomC from '@/components/test/VcomC.vue'
export default {
    name: "VcomB",
    inject: ['for'],
    data() {
        return {
            demo: this.for + '123',
            data: 123,
        }
    },
    components: {
        VcomC,
    }
}
</script>

// C组件
<template>
    <div>
      {{demo}}
    </div>
</template>
<script>
    export default {
      name: "VcomC",
      inject: ['for'],
      data() {
        return {
          demo: this.for
        }
      }
    }
</script>
```

## 4.[跨级别 $attr](https://blog.csdn.net/qq_38128179/article/details/99626385)
`$attr`就是子组件可以通过未在自己组件内注册的`props`数据参数接收，并且传给下一辈。

## 5.事件总线 eventbus
`eventBus`，就是vue中所有组件共用的一个事件中心，可以理解成就是一辆公交车，然后所有的组件都可以在公交车上挂载事件和接收事件。

```Javascript
// 1.初始化
import Vue from 'vue'
export const EventBus = new Vue()

//2.发送事件
EventBus.$emit('addition', {
  num:this.num++
})

//3.接收事件
EventBus.$on('addition', param => {
  this.count = this.count + param.num;
})
//4.删除事件
EventBus.$off('addition', {})
```

## 6.Vuex状态管理

### Vuex是什么？
Vuex也是解决跨组件数据共享的问题，是vue的状态管理器，就是可以把组件的数据集中起来，方便维护。

### Vuex怎么做的？

Vue将数据挂载到根组件，并用五个对象来维护这个状态管理器。

- state:存储状态，设置变量。
- getters: 类似于set，get中的get，其作用在于获取state变量和其它getters，就和vue中的computed差不多。外部调用方式：`store.getters.fn()`
- mutations: 类似于set，get中的set，负责状态数据修改，但只支持同步。外部调用方式：`store.commit('fn',12)`
- ations: 和mutations一样，但是支持异步操作。外部调用方式：`store.dispatch('fn')`
- modules: 就是store的子模块，用来模块化管理store。


### Vuex和全局变量有什么区别？

1. Vuex的数据是响应式的，当store中是数据更新，组件中是数据也会更新
2. Vuex的数据是统一修改的，而全局变量可以随意修改，不是很安全。
3. 全局变量容易造成命名污染，但是Vuex不会。

