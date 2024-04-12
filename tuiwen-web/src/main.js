import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp, provide, ref } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { languages } from './languages'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const loading = ref(false)
const language = ref(localStorage.getItem('language') || 'English')
app.provide('loading', loading)
app.provide('language', language)
app.provide('languages', languages)
router.beforeEach((to, from, next) => {
  next()
})

app.mount('#app')
