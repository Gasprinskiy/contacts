import "./assets/main.css";
import "./shim.d.ts";
import { createApp } from "vue";
import App from "./AppWrapper.vue";
import router from "./router";
import { InjectionKeysMap, InjectionImplMap } from "./request_worker";

const app = createApp(App)

Object.keys(InjectionKeysMap).forEach(key => {
    app.provide(InjectionKeysMap[key], InjectionImplMap[key])
})

app.use(router)
app.mount('#app')
