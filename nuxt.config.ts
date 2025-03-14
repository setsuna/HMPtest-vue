// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer:{
    host: '0.0.0.0',
    port: 3000
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts'
  ],

  css: ['~/assets/css/styles.css'],

  app: {
    head: {
      title: '硬件综合平台',
      meta: [
        { name: 'description', content: '集成指纹识别、身份证识别和高拍仪等功能的硬件测试平台' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  }
})