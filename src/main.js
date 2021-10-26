import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import '../elemeny-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import './network/http';
Vue.config.productionTip = false
//引用vue-quill-editor组件和样式
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
//全局时间过滤
Vue.filter('dateFormat',function (originVal){
  const dt = new Date(originVal * 1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate()+ '').padStart(2,'0')

  const hh = (dt.getHours()+ '').padStart(2,'0')
  const mm = (dt.getMinutes()+ '').padStart(2,'0')
  const ss = (dt.getMilliseconds()+ '').padStart(2,'0')

  const DateStr = `${y}-${m}-${d} ${hh}:${mm}:${ss}`

  return DateStr
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
