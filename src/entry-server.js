// 用于首屏渲染
import createApp from './main'

export default context => {
  return new Promise((resolve, reject) => {
    // 获取路由器，app 实例
    const {app, router} = createApp(context)
    // 获取首屏地址
    router.push(context.url)
    router.onReady(() => {
      resolve(app)
    }, reject)
  })
}