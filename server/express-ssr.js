const express = require('express')
const Vue = require('vue')

const server = express()

// 获取渲染器实例
const { createRenderer } = require('vue-server-renderer')
const renderer = createRenderer()

server.get('/', (req, res) => {
  const app = new Vue({
    template: '<div>{{ msg }}</div>',
    data() {
      return {
        msg: 'vue ssr'
      }
    },
  })

  // 用渲染器渲染 Vue 实例
  renderer.renderToString(app).then((html) => {
    res.send(html)
  }).catch(() => {
    res.status(500)
    res.send('Internal Server Error')
  })
})

server.listen(80, () => {
  console.log('server running')
})