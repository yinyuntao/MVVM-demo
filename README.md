### Vue 2.0x  

#### vue2.0  响应式变化

1. 监听data这个对象的所有属性
    通过Object.defineProperty(obj,val,{});
    如果data对象为深层的嵌套,需要通过判断是否为对象或者数组来递归

    这样当获取对应的数据会触发defineProperty中的getter
    这样当修改对应的数据会触发defineProperty中的setter

    另外： 对于数据中push,unshift等方法的操作，不能触发响应式变化
    需要创建一个数组上的空对象拦截器，当执行push等方法时，使其触发setter,以及更新视图，并且给定数组中的新的数据绑定响应式

    响应式原理：首先通过数据劫持发布订阅方式，以Object.defineProperty劫持data中每个属性，通过模板解析(vue的指令等)获取数据渲染到视图上，触发getter方法收集依赖，通过修改数据触发setter方法更新对应视图，并且将新的数据绑定为响应式。
2.  虚拟Dom
    虚拟dom对象，其核心是dom-diff算法
    由于操作DOM 性能消耗太高,vue 通过虚拟Dom对象先创建，缓存，比对当前修改的DOM对象
    (注释节点 文本节点 元素节点)
    进行新增节点
    删除节点
    跟新节点
    通过dom-diff 算法比对

3.  vue.$set  与 vue.$delete
    对于数组下标的新增，对象的新增没有实现响应式 所以vue封装了这个方法
       ①如果是数组 使用之前splice方法使其响应式[数组在原型上封装了常用的方法]
       ②如果是对象 使用之前新增这个对象 使其响应式
            
4.  vue.$nextick 
    为什么会有这个方法呢？
    因为vue 数据是异步更新的，当你更新这个数据之后不能立马获取，需要通过$nextick异步函数获取
5.  vue.$forceUpdate
    更新数据 从新劫持数据，更新视图  
    如果不用$set  可以使用$forceUpdate
6.  keep-live 
    组件切换保存之前的状态，没有被销毁实例
    