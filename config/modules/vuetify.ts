import { NuxtOptionsModule } from '@nuxt/types/config/module'

// https://go.nuxtjs.dev/axios
const vuetify: NuxtOptionsModule = [
  '@nuxtjs/vuetify',
  {
    icons: {
      iconfont: 'md'
    },
    theme: { dark: false }
  }
]

export default vuetify
