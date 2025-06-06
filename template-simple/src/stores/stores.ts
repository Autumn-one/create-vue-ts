import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

pinia.use( piniaPluginPersistedstate ); // pinia 的持久化插件 : https://www.npmjs.com/package/pinia-plugin-persistedstate

export { pinia };
