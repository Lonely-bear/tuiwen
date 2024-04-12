<script setup>
import { ref, inject, watch } from 'vue';
import { ElNotification } from 'element-plus';
import { voice_emotion } from './voice_emotion.js'

// ------------------语言------------------
const languages = inject('languages')
const language = inject('language')
const currentLanguage = ref(languages[language.value])
watch(() => language.value, () => {
  currentLanguage.value = languages[language.value]
})
// ------------------语言------------------

const settings = ref([])
const querySetting = async () => {
  const res = await fetch('http://localhost:3000/setting/query')
  settings.value = await res.json()
}
querySetting()

const showVoices = ref(false)
const voices = ref([])
const queryVoice = async () => {
  const res = await fetch('voice.json')
  voices.value = await res.json()
}
queryVoice()

const showEditDialog = ref(false)
const form = ref({})
const saving = ref(false)
const edit = (row) => {
  if (row.key === 'aliyun_voice') {
    form.value = JSON.parse(JSON.stringify(row))
    showVoices.value = true
    return
  }
  form.value = JSON.parse(JSON.stringify(row))
  showEditDialog.value = true
}
const save = async () => {
  saving.value = true
  const res = await fetch('http://localhost:3000/setting/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form.value)
  })
  const data = await res.json()
  if (data.code === 0) {
    showEditDialog.value = false
    ElNotification({
      title: currentLanguage.value['NotificationSuccessTitle'],
      message: currentLanguage.value['update'] + form.value.name + currentLanguage.value['NotificationSuccessTitle'],
      type: 'success',
    })
    querySetting()
  } else {
    ElNotification({
      title: currentLanguage.value['NotificationErrorTitle'],
      message: currentLanguage.value['update'] + form.value.name + currentLanguage.value['lose'],
      type: 'error',
    })
  }
  saving.value = false
}
const changeVoice = (row) => {
  form.value.value = row.voice
  save()
}
</script>

<template>
  <div class="container">
    <h3 class="title">{{ currentLanguage['global_config_title'] }}</h3>
    <el-table v-if="settings" :data="settings" header-cell-class-name="custom-table-header">
      <el-table-column prop="name" :label="currentLanguage['name']"></el-table-column>
      <el-table-column prop="key" :label="currentLanguage['key']"></el-table-column>
      <el-table-column prop="value" :label="currentLanguage['value']"></el-table-column>
      <el-table-column :label="currentLanguage['operator']" width="100">
        <template #default="{ row }">
          <el-button type="primary" link @click="edit(row)">{{ currentLanguage['edit'] }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="showEditDialog" :title="form.name">
    <div class="form">
      <el-form label-width="80px">
        <el-form-item :label="currentLanguage['key']">
          <el-input v-model="form.key" disabled></el-input>
        </el-form-item>
        <el-form-item :label="currentLanguage['value']">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button color="#626aef" :loading="saving" @click="save">{{ currentLanguage['save'] }}</el-button>
    </template>
  </el-dialog>
  <el-drawer :title="currentLanguage['aliyun_title']" v-model="showVoices" size="90%">
    <h2 style="margin: 15px 0;text-align: center;">{{ currentLanguage['aliyun_emotion_value'] }}</h2>
    <h3 style="margin: 15px 0;text-align: center;color: rgb(218, 82, 82)">{{ currentLanguage['aliyun_tips'] }}</h3>
    <el-table :data="voice_emotion" header-cell-class-name="custom-table-header">
      <el-table-column prop="name" :label="currentLanguage['name']" width="150"></el-table-column>
      <el-table-column prop="voice" label="voice" width="150"></el-table-column>
      <el-table-column prop="emotion" :label="currentLanguage['has_emotions']"></el-table-column>
      <el-table-column :label="currentLanguage['operator']" width="100">
        <template #default="{ row }">
          <el-button v-if="row.voice === form.value" size="small" color="#626aef" disabled>{{ currentLanguage['choose']
          }}</el-button>
          <el-button v-else color="#626aef" size="small" @click="changeVoice(row)">{{ currentLanguage['switch']
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h2 style="margin: 15px 0;text-align: center;">{{ currentLanguage['aliyun_value'] }}</h2>
    <el-table :data="voices" header-cell-class-name="custom-table-header">
      <el-table-column prop="name" :label="currentLanguage['name']"></el-table-column>
      <el-table-column prop="voice" label="voice"></el-table-column>
      <el-table-column prop="type" :label="currentLanguage['type']"></el-table-column>
      <el-table-column prop="scene" :label="currentLanguage['scene']"></el-table-column>
      <el-table-column prop="language" :label="currentLanguage['language']"></el-table-column>
      <el-table-column prop="sample" :label="currentLanguage['sample']" width="150"></el-table-column>
      <el-table-column prop="timestamp" :label="currentLanguage['timestamp']" width="150"></el-table-column>
      <el-table-column prop="erhuayin" :label="currentLanguage['erhuayin']"></el-table-column>
      <el-table-column prop="quality" :label="currentLanguage['quality']"></el-table-column>
      <el-table-column :label="currentLanguage['operator']" width="100">
        <template #default="{ row }">
          <el-button v-if="row.voice === form.voice" color="#626aef" disabled>{{ currentLanguage['currentChoose']
          }}</el-button>
          <el-button v-else color="#626aef" size="small" @click="changeVoice(row)">{{ currentLanguage['switch']
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<style scoped>
.container {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px 20px;
  box-sizing: border-box;
}

.title {
  font-size: 20px;
  width: 100%;
  text-align: center;
}

.form {
  width: 100%;
}

.foot {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.tip {
  font-size: 12px;
  color: #666;
  padding-left: 1em;
}
</style>