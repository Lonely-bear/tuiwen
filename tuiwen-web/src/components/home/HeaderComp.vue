<script setup>
import { ref, inject } from 'vue'
import { ElNotification } from 'element-plus';

// ------------------语言------------------
const languages = inject('languages')
const languageOptions = Object.keys(languages).map(key => ({
  key,
  value: key
}))
const language = inject('language')
const currentLanguage = ref(languages[language.value])
const changeLanguage = (name) => {
  language.value = name
  localStorage.setItem('language', name)
  currentLanguage.value = languages[name]
}
// ------------------语言------------------

function onClick() {
  ElNotification({
    title: '(✿◡‿◡)',
    message: currentLanguage.value['click_avatar_msg'],
    type: 'success',
  })
}
</script>

<template>
  <div class="left">
    Halo
    <el-select style="margin-left: 20px;" @change="changeLanguage" v-model="language">
      <el-option v-for="(item, index) in languageOptions" :key="index" :label="item.key" :value="item.value"
        :selected="item.value === language" />
    </el-select>
  </div>
  <div class="right">
    <el-icon class="user-avatar" color="#4713b9" @click="onClick">
      <User />
    </el-icon>
  </div>
</template>

<style scoped>
.left {
  margin-left: 15px;
}

.right {
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    padding: 6px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .12);
  }
}
</style>