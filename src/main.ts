import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useBundlesStore } from '@/stores/bundles'
import { catalog } from '@/catalog'

import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(router)

const store = useBundlesStore(pinia)
store.initializeCatalog(catalog)

app.mount('#app')
