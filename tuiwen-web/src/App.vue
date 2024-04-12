<script setup>
import HeaderComp from '@/components/home/HeaderComp.vue'
import AsideComp from '@/components/home/AsideComp.vue'
import { RouterView } from 'vue-router'
import { inject, provide, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

// ------------------语言------------------
const languages = inject('languages')
const language = inject('language')
const currentLanguage = ref(languages[language.value])
watch(() => language.value, () => {
  currentLanguage.value = languages[language.value]
})
// ------------------语言------------------

const router = useRouter()
const loading = inject('loading')
const active = ref('')
const changeActive = (name) => {
  active.value = name
}
watch(() => active.value, () => {
  router.push('/' + active.value)
}, { immediate: true })

let $ws = reactive(new WebSocket('ws://localhost:3001'))
$ws.onopen = () => {
  ElNotification({
    title: currentLanguage.value['NotificationSuccessTitle'],
    message: currentLanguage.value['NotificationWsSuccessMsg'],
    type: 'success',
  })
  console.log('WebSocket Client Connected')
}
$ws.onclose = () => {
  ElNotification({
    title: currentLanguage.value['NotificationErrorTitle'],
    message: currentLanguage.value['NotificationWsErrorMsg'],
    type: 'error',
  })
}

provide('$ws', $ws)
</script>

<template>
  <el-container class="container">
    <el-header class="header">
      <HeaderComp />
    </el-header>
    <el-main class="main">
      <AsideComp :active="active" @changeActive="changeActive" />
      <div class="box" v-loading="loading">
        <RouterView />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  min-width: 1224px;
}

.header {
  background-color: #F7FAFC;
  color: #26244c;
  padding: 0 30px;
  box-sizing: border-box;
  font-size: 30px;
  font-weight: bold;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
}

.box {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #F7FAFC;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
