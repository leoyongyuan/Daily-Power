# diff 算法

## 什么是虚拟DOM？
Virtual DOM 其实就是一颗以Javascript对象为基础的树，用对象属性来描述结点。
```Javascript
// 实际DOM
<ul id='list'>
  <li class='item'>Item 1</li>
  <li class='item'>Item 2</li>
  <li class='item'>Item 3</li>
</ul>

// 虚拟DOM
var element = {
    tagName: 'ul', // 节点标签名
    props: { // DOM的属性，用一个对象存储键值对
        id: 'list'
    },
    children: [ // 该节点的子节点
      {tagName: 'li', props: {class: 'item'}, children: ["Item 1"]},
      {tagName: 'li', props: {class: 'item'}, children: ["Item 2"]},
      {tagName: 'li', props: {class: 'item'}, children: ["Item 3"]},
    ]
}
```

### 虚拟DOM的好处
DOM是很慢的，DOM上的结点挂载着大量的属性，因此相比于操作DOM的行为，显然是把DOM转化成对象来操作更具有效率。

因此虚拟DOM可以有效提高效率，并且在实际渲染时，虚拟DOM还可以避免大量无谓的计算。

当我们用原生Javascript操作DOM时，假设我们修改10个DOM结点，每一次修改DOM都会重新去构造DOM树，而虚拟DOM可先把这些修改转成Javascript对象，然后在一次性全部更新到DOM树。

## [diff算法的过程](https://segmentfault.com/a/1190000020663531)
diff算法是一个通过同层的树结点进行比对的算法。

大致过程就是用新的DOM和旧的DOM对比，查询过程是用两组双指针进行比对。

- oldstart == newstart || oldend == newend: 此时只需要把结点更新到DOM上。 
- oldstart == newend || oldend == newstart：也就是出现头尾/尾头相同的情况，那么会依旧新的DOM，把结点插入到旧结点后面
- 处理新增结点：如果一个结点在oldVNode中不存在，则新建结点，将其插入到oldstart指针指向的结点前面
- 处理更新位置结点：如果找到一个结点，但是不在oldVNode旧指针的位置，就确定结点的位置发生了变化，我们需要把该节点移到oldstart指针指向的结点前面，并标记为以处理
- 处理删除结点：如果循环到最后，newstart和newend相遇了，但是oldstart与oldend为相遇，就确定有结点被删除了，那么就遍历oldVNode之间的结点，把未标记的结点删除。

## key的作用

key的作用是为了高效更新虚拟DOM，在diff算法中同一层级的一组结点，他们可以通过key的唯一id来区分。

### [是否可以用数组下标作为key](https://juejin.cn/post/6844903577215827982)

不可以，假设我们对组件进行一些操作，这样可能会导致vue重新渲染key的值，比如我们像数组中间插入一个新的值，再来vue渲染，那这样数组从插入位置后面的key都会重新渲染。


### [为什么不用随机数作为key](https://juejin.cn/post/6844904113587634184#heading-12)

在diff算法中，是需要借助key的唯一id来建立一个映射表。如果用随机数的话的确可以保证唯一性，但是随机数也在每次渲染后会变成一个新的值，因此不可取。
