class Observer {
    constructor(value) {
        this.value = value;

        if (Array.isArray(value)) {
            //监听数组的处理方法
            augment(value, arrayMethods, arrayKeys)
        } else {
            this.walk(value);
        }
    }
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }
}

function defineReactive(obj, key, val) {
    if (arguments.length === 2) {
        val = obj[key];
    }

    if (typeof val === 'object') {
        new Observer(val);
    }
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            console.log(`${key}属性被读取了`)
            dep.depend();
            return val;
        },
        set(newVal) {
            if(val === newVal) {
                return;
            }
            console.log(`${key}属性被修改了`)
            val=newVal;
            dep.notify()
        }
    })
}

// getter中收集依赖 setter 触发更新
class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub)
    }
    removeSub(sub) {
        remove(this.subs,sub)
    }
    depend() {
        if(window.target) {
            this.addSub(window.target)
        }
    }
    notify() {
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
            console.log('触发依赖更新数据')
          }
    }
}

function remove(arr,item) {
    if(arr.length) {
        const index = arr.indexOf(item)
        if(index>-1) {
            return arr.splice(index,1)
        }
    }
}

class Watcher {
    constructor(vm,expOrFn,cb) {
        this.vm=vm;
        this.cb=cb;
        this.getter = parsePath(expOrFn);
        this.value=this.get();
    }

    get() {
        window.target = this;
        const vm = this.vm;
        let value = this.getter.call(vm,vm);
        window.target=undefined;
        return value;
    }

    update() {
        const oldValue = this.value;
        this.value = this.get();
        this.cb.call(this.vm,this.value,oldValue)
    }
}

const bailRE = /[^\w.$]/
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}


// 使用拦截器 拦截数组

const arrayProto = Array.prototype;

const arrayMethods = Object.create(arrayProto);

const methodsToPath = ['push','pop','shift','unshift','splice','sort','reverse']

methodsToPath.forEach((method)=>{
    const original = arrayMethods[method];

    Object.defineProperty(arrayMethods,method,{
        enumerable: false,
        configurable: true,
        writable: true,
        value: function mutator(...args) {
            const result = original.apply(this,args)
            return result;
        }
    })
})



