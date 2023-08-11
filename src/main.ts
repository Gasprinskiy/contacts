import './assets/main.css'

import { createApp } from 'vue'
import App from './AppWrapper.vue'
import router from './router'
import { InjectionKeysMap, InjectionImplMap } from './request_worker'

const app = createApp(App)

Object.keys(InjectionKeysMap).forEach(injection => {
    app.provide(InjectionKeysMap[injection], InjectionImplMap[injection])
})

app.use(router)
app.mount('#app')
