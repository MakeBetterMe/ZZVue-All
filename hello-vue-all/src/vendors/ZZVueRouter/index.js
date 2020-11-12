let _Vue = null
export default class ZZVueRouter {
  // Vue.use注册插件的时候，install第一个参数为Vue
  static install (Vue) {
    if (this.install.installed) { // 防止重复注册
      return
    }
    ZZVueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      // vue组件实例在创建的时候，把new Vue()传入的router，注入到Vue的原型上，这样每个vue实例都可以使用this.$router
      beforeCreate () {
        // console.log(this)
        // console.log(this.$options.router)
        // console.log(this instanceof _Vue) === true this是Vue的一个实例
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  // 构造参数
  constructor (options) {
    this.options = options
    this.routeMap = {} // 存放path和component映射关系
    // router实例的数据对象，是响应式的
    this.data = _Vue.observable({
      current: '/'
    })
    this.init()
  }

  init () {
    this.createRouteMap()
    this.initComponents()
    this.initEvents()
  }

  // 初始化routeMap
  createRouteMap () {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  // 注册全局组件
  initComponents () {
    // 创建router-link组件，router-link实际上是a标签
    _Vue.component('router-link', {
      name: 'router-link',
      props: {
        to: String
      },
      // 渲染函数，返回虚拟dom节点
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])// 默认插槽当做内容
      },
      methods: {
        clickHandler (e) {
          // 这里的this指的是组件实例，组件实例是可以访问到$router的,修改router当前地址
          this.$router.data.current = this.to
          // // 修改地址栏url，并朝历史记录写入一条
          window.history.pushState({}, '', this.to)
          e.preventDefault() // 阻止a标签的默认跳转行为
        }
      }
    })

    const self = this // 此时的this是router
    // 创建router-view组件
    _Vue.component('router-view', {
      name: 'router-view',
      // 渲染函数，返回虚拟dom节点，如果h方法传入的是个组件的话，就返回这个组件的虚拟dom
      render: function (h) {
        // 这里面的this其实是组件本身
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvents () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
