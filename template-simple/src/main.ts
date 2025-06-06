import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import {router} from "@/router/router.ts"
import { pinia } from "@/stores/stores.ts";


const app = createApp( App );
app.use(router)
app.use(pinia)
app.mount( "#app" );
