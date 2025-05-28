import Main from "@/views/Main/Main.vue";
import {createRouter, createWebHashHistory} from "vue-router";
const routes = [
    {path: "/", component: Main},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export {
    router
}