<style scoped>

</style>

<template>
    <h1>这是{{ state.msg }}：开始你的项目吧！{{ store_global.locale }}</h1>
</template>
<script setup lang="ts">


const store_global = useStoreGlobal()

var a = 123;
var b = 666;

const state = reactive({
    msg: "首页"
})
</script>

