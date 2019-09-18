import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll';
import GeminiScrollbar from 'vue-gemini-scrollbar'

Vue.config.productionTip = false

//IE兼容promise
import 'babel-polyfill'

//引入自定义样式
import './assets/css/common.css'
import './assets/icon/iconfont.css'

Vue.use(ElementUI);

Vue.use(infiniteScroll);
Vue.use(GeminiScrollbar)
Vue.use(VueLazyload, {
  preLoad: 1.3,//元素距离页面底部距离的百分比
  lazyComponent: true,//是否启用懒加载组件
  //error: 'dist/error.png',
  loading: require('@/assets/loading.gif'),
  attempt: 3,//图片加载失败后的重试次数
  listenEvents: [ 'scroll' ],
  observer:true,//可选
  observerOptions:{ rootMargin: '0px', threshold: 0.1 }
});

/**
 * vue.js和avalon.js 都是通过它实现双向绑定的。。
 * 而且Object.observe也被草案发起人撤回了。。所以defineProperty更有必要了解一下了几行代码看他怎么用

 * var a= {}
 * Object.defineProperty(a,"b",{
 *      value:123
 *    })
 * console.log(a.b);//123
 * 很简单，，它接受三个参数，而且都是必填的。。
 *
 * 传入参数
 * 第一个参数:目标对象
 *
 * 第二个参数:需要定义的属性或方法的名字。
 *
 * 第三个参数:目标属性所拥有的特性。（descriptor）
 *
 * 前两个参数不多说了，一看代码就懂，主要看第三个参数descriptor，看看有哪些取值
 *
 * <h2>descriptor</h2>
 * 他又以下取值，我们简单认识一下，后面例子，挨个介绍，
 *
 * value:属性的值(不用多说了)
 *
 * writable:如果为false，属性的值就不能被重写,只能为只读了
 *
 * configurable:总开关，一旦为false，就不能再设置他的（value，writable，configurable）
 *
 * enumerable:是否能在for...in循环中遍历出来或在Object.keys中列举出来。
 *
 * get:一会细说
 *
 * set:一会细说
 */
/*Object.defineProperty(Vue.prototype,'_',{value:_})
Object.defineProperty(Vue.prototype,'iatpHttp',{value: iatpHttp})*/
Object.defineProperty(Vue.prototype, '$moment', { value: moment })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
