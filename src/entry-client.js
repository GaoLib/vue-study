// 客户端激活
import createApp from './main'

const {app, router} = createApp(context)

router.onReady(() => {
  // 挂载激活
  app.$mount('#app')
})