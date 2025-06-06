import {defineStore} from "pinia";

const useStoreGlobal = defineStore("global", {
    persist: {
        pick: ["locale"]
    },
    state: () => ({
        locale: "zh-cn"
    }),
})

export {useStoreGlobal}