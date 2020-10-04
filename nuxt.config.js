module.exports = {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    isRunning: process.env.IS_RUNNING || false
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxt-twitter-auth',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, itial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3b8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config) {
      if (process.server && process.browser) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }
  },
  serverMiddleware: ['~/server'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
}

