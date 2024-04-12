<script setup>
import { watch, ref, inject } from 'vue'
import { ElNotification } from 'element-plus';

// ------------------语言------------------
const languages = inject('languages')
const language = inject('language')
const currentLanguage = ref(languages[language.value])
watch(() => language.value, () => {
  currentLanguage.value = languages[language.value]
})
// ------------------语言------------------

// TODO: aaa
const test = ref('')

const $ws = inject('$ws')

const form = ref({
  name: '',
  textContent: '',
  textContentSplit: [],
  textContentSplitLength: 0,
})

function formatTextContent(str) {
  let lines = str.split('\n');
  // 删除空行
  lines = lines.filter(line => line.trim() !== '');
  // 删除首尾空格
  lines = lines.map(line => line.trim());
  return lines.join('\n');
}

function handleTextSplit(str) {
  str = formatTextContent(str);

  let lines = str.split('\n');
  let result = [];

  for (let line of lines) {
    if (line.length <= 80) {
      if (result.length === 0 || (result[result.length - 1] + line).length > 200) {
        result.push(line);
      } else {
        result[result.length - 1] += line;
      }
    } else {
      result.push(line);
    }
  }

  form.value.textContentSplit = result
  form.value.textContentSplitLength = result.length

  test.value = result.join('\n')
}

watch(() => form.value.textContent, (val) => {
  if (!val) {
    form.value.textContentSplit = []
    form.value.textContentSplitLength = 0
    return
  }
  handleTextSplit(val)
})

function handleAddProject() {
  if (!form.value.name || !form.value.textContent) {
    ElNotification({
      title: currentLanguage.value['NotificationErrorTitle'],
      message: currentLanguage.value['NotificationWsNoEmptyMsg'],
      type: 'error',
    })
    return
  }

  const data = {
    name: form.value.name,
    textContent: form.value.textContent,
    textContentSplit: form.value.textContentSplit,
    textContentSplitLength: form.value.textContentSplitLength
  }

  if (!$ws) {
    ElNotification({
      title: currentLanguage.value['NotificationErrorTitle'],
      message: currentLanguage.value['NotificationWsErrorMsg'],
      type: 'error',
    })
    return
  }
  $ws.send(JSON.stringify({
    type: 1,
    data
  }))
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    textContent: '',
    textContentSplit: [],
    textContentSplitLength: 0,
  }
}
</script>

<template>
  <el-scrollbar height="100%">
    <div class="container">
      <div class="form">
        <el-form :model="form" label-width="10em" label-position="left">
          <el-form-item :label="currentLanguage['project_name']" prop="name">
            <el-input v-model="form.name" :placeholder="currentLanguage['project_name']"></el-input>
          </el-form-item>
          <el-form-item :label="currentLanguage['project_text_content']" prop="textContent">
            <el-input v-model="form.textContent" :placeholder="currentLanguage['project_text_content_placeholder']"
              type="textarea" :autosize="{ minRows: 8, maxRows: 12 }"></el-input>
          </el-form-item>
          <el-form-item :label="currentLanguage['project_p_num']" prop="name">
            <el-input disabled v-model="form.textContentSplitLength"
              :placeholder="currentLanguage['project_p_num_placeholder']"></el-input>
          </el-form-item>
          <el-form-item :label="currentLanguage['project_split_content']" prop="textContentSplit">
            <el-input style="margin-bottom: 10px;" v-for="(item, index) in form.textContentSplit" :key="index"
              :placeholder="currentLanguage['project_split_content_placeholder']" type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }" readonly :value="item"></el-input>
            <el-input v-if="form.textContentSplit.length === 0"
              :placeholder="currentLanguage['project_split_content_placeholder']" type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }" readonly></el-input>
          </el-form-item>
          <el-form-item>
            <div class="confirmBtn" @click="handleAddProject">{{ currentLanguage['confirmText'] }}</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-scrollbar>
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
  padding-bottom: 150px;
}

.tip {
  font-size: 12px;
  color: #666;
  padding-left: 1em;
}

.confirmBtn {
  width: 80px;
  height: 80px;
  background-color: #626aef;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translate(-50%, 0);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.confirmBtn:hover {
  background-color: #4c54d8;
}
</style>