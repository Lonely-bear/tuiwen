<script setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { inject, ref, watch } from 'vue'

// ------------------语言------------------
const languages = inject('languages')
const language = inject('language')
const currentLanguage = ref(languages[language.value])
watch(() => language.value, () => {
  currentLanguage.value = languages[language.value]
})
// ------------------语言------------------

const projects = ref(null)
fetch('http://localhost:3000/projects/query')
  .then(res => res.json())
  .then(data => {
    projects.value = data
  })

const showDetail = ref(false)
const project_texts = ref(null)
const current_project = ref(null)
function onOpenDetail(row) {
  current_project.value = row
  fetch('http://localhost:3000/project/query?project_id=' + row.id)
    .then(res => res.json())
    .then(data => {
      project_texts.value = data
      showDetail.value = true
    })
}

const $ws = inject('$ws')
let timer = null
let timer2 = null
$ws.onmessage = (message) => {
  const data = JSON.parse(message.data)
  console.log(message.data)
  if (typeof data === 'string') {
    ElNotification({
      title: currentLanguage.value['NotificationSuccessTitle'],
      message: data,
      type: 'success',
    })
    return
  } else {
    if (data.refresh === 99) {
      ElMessageBox({
        message: data.msg,
        confirmButtonText: currentLanguage.value['cancel_auto_close_PC'],
        showCancelButton: false
      }).then((e) => {
        if (e === 'confirm') {
          $ws.send(JSON.stringify({
            type: 998,
          }))
        }
      })
    }
    if (data.refresh === -1) {
      ElNotification({
        title: currentLanguage.value['NotificationErrorTitle'],
        message: data.msg,
        type: 'error',
      })
    }
    if (data.refresh === 0) {
      ElNotification({
        title: currentLanguage.value['NotificationSuccessTitle'],
        message: data.msg,
        type: 'success',
      })
    }
    if (data.refresh === 1) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        ElNotification({
          title: currentLanguage.value['NotificationSuccessTitle'],
          message: data.msg,
          type: 'success',
        })
        fetch('http://localhost:3000/project/query?project_id=' + current_project.value.id)
          .then(res => res.json())
          .then(data => {
            project_texts.value = data
          })
      }, 1000)
    }
    if (data.refresh === 2) {
      if (timer2) clearTimeout(timer2)
      timer2 = setTimeout(() => {
        ElNotification({
          title: currentLanguage.value['NotificationSuccessTitle'],
          message: data.msg,
          type: 'success',
        })
        showDetail.value = false
        fetch('http://localhost:3000/projects/query')
          .then(res => res.json())
          .then(data => {
            projects.value = data
          })
      }, 1000)
    }
  }
}
function onClickAll() {
  if (!$ws) return
  $ws.send(JSON.stringify({
    type: 99,
    data: {
      project_id: current_project.value.id,
      project_name: current_project.value.name
    }
  }))

}
function onClickPrompt() {
  if (!$ws) return
  $ws.send(JSON.stringify({
    type: 2,
    data: {
      project_id: current_project.value.id
    }
  }))
}
function onClickAudio() {
  if (!$ws) return
  $ws.send(JSON.stringify({
    type: 3,
    data: {
      project_id: current_project.value.id,
      project_name: current_project.value.name
    }
  }))
}
function onClickImage() {
  if (!$ws) return
  $ws.send(JSON.stringify({
    type: 4,
    data: {
      project_id: current_project.value.id,
      project_name: current_project.value.name
    }
  }))
}
function onClickDraft() {
  if (!$ws) return
  $ws.send(JSON.stringify({
    type: 5,
    data: {
      project_id: current_project.value.id,
      project_name: current_project.value.name
    }
  }))
  ElNotification({
    title: currentLanguage.value['NotificationSuccessTitle'],
    message: currentLanguage.value['draft_gen_complete'],
    type: 'success',
  })
}

async function deleteDetail(ids, type) {
  const res = await fetch('http://localhost:3000/detail/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ids,
      type
    })
  })
  const data = await res.json()
  if (data.code === 0) {
    ElNotification({
      title: currentLanguage.value['NotificationSuccessTitle'],
      message: currentLanguage.value['NotificationDeleteMsg'],
      type: 'success',
    })
    onOpenDetail(current_project.value)
  } else {
    ElNotification({
      title: currentLanguage.value['NotificationErrorTitle'],
      message: data.msg,
      type: 'error',
    })
  }
}

const showAllDialog = ref(false)
const allData = ref({
  autoClosePC: false,
  data: [],
})
function onOpenAllDialog() {
  showAllDialog.value = true
}
function onClickAllTask() {
  const data = allData.value.data.map(item => {
    const [id, name] = item.split('|||')
    return {
      data: {
        project_id: id,
        project_name: name,
      }
    }
  })
  if (data.length === 0) {
    ElMessage({
      type: 'error',
      message: currentLanguage.value['NotificationWsProjectEmptyMsg'],
    })
    return
  }
  if (!$ws) return
  $ws.send(JSON.stringify({
    type: 999,
    autoClosePC: allData.value.autoClosePC,
    data,
  }))
  ElNotification({
    title: currentLanguage.value['NotificationSuccessTitle'],
    message: currentLanguage.value['NotificationWsProjectAllStartMsg'],
    type: 'success',
  })
  allData.value = {
    autoClosePC: false,
    data: [],
  }
  showAllDialog.value = false
}

async function deleteProject(item) {
  ElMessageBox({
    message: currentLanguage.value['NotificationDeleteAskMsg'],
    confirmButtonText: currentLanguage.value['okText'],
    cancelButtonText: currentLanguage.value['cancelText'],
    showCancelButton: true
  }).then(async (e) => {
    if (e === 'confirm') {
      const res = await fetch('http://localhost:3000/project/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: item.id
        })
      })
      const data = await res.json()
      if (data.code === 0) {
        ElNotification({
          title: currentLanguage.value['NotificationSuccessTitle'],
          message: currentLanguage.value['NotificationDeleteMsg'],
          type: 'success',
        })
        fetch('http://localhost:3000/projects/query')
          .then(res => res.json())
          .then(data => {
            projects.value = data
          })
      } else {
        ElNotification({
          title: currentLanguage.value['NotificationErrorTitle'],
          message: data.msg,
          type: 'error',
        })
      }
    }
  })
}

const searchKeyValue = ref('')
async function onSearch() {
  const res = await fetch('http://localhost:3000/projects/query?name=' + searchKeyValue.value)
  const data = await res.json()
  projects.value = data
}
</script>

<template>
  <div>
    <h3 class="title">{{ currentLanguage['project_list_1'] }}</h3>
    <h4 class="title" style="font-size: 16px;">{{ currentLanguage['project_list_2'] }}</h4>
    <div class="search">
      <el-input v-model="searchKeyValue" style="width: 30%;" size="large"
        :placeholder="currentLanguage['searchKeyValue']">
        <template #append>
          <el-button type="primary" @click="onSearch">
            <el-icon>
              <Search />
            </el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
    <el-empty v-if="!projects || projects.length === 0" :description="currentLanguage['no_project_msg']" />
    <div v-else class="card-list">
      <div style="width: 100%;margin-bottom: 20px;">
        <el-button color="#626aef" @click="onOpenAllDialog">{{ currentLanguage['all_task_btn'] }}</el-button>
        ＺZz...(:˒[￣]
      </div>
      <el-card v-for="( item, index ) in  projects " :key="index" style="width: 30%;margin-bottom: 20px;">
        <template #header>
          <h3 style="display: flex;align-items: center;gap: 10px;">
            <el-icon size="24" color="green" v-if="item.draft">
              <CircleCheck />
            </el-icon>
            {{ item.name }}
          </h3>
        </template>
        <div>
          <el-input type="textarea" :value="item.textContent" :autosize="{ minRows: 5, maxRows: 5 }" autosize readonly
            style="margin-bottom: 15px;"></el-input>
          <el-button color="#626aef" @click="onOpenDetail(item)">
            {{ currentLanguage['project_detail_btn_name'] }}
          </el-button>
          <el-button type="danger" @click="deleteProject(item)">
            {{ currentLanguage['project_delete_btn_name'] }}
          </el-button>
          <el-link type="primary" v-if="item.draft" :href="item.draft" target="_blank" style="margin-left: 20px;">
            <el-icon size="22">
              <FolderChecked />
            </el-icon>
            <span style="margin-left: 10px;">
              {{ currentLanguage['project_download_btn_name'] }}
            </span>
          </el-link>
        </div>
      </el-card>
    </div>
  </div>
  <el-dialog v-model="showAllDialog" :title="currentLanguage['autoTasksDialogTitle']">
    <el-form label-width="120" label-position="left">
      <el-form-item :label="currentLanguage['autoTasksDialogProjects']">
        <el-select v-model="allData.data" multiple style="width: 100%;"
          :placeholder="currentLanguage['autoTasksDialogProjectsPlaceholder']">
          <el-option v-for="( item, index ) in  projects " :key="index" :label="item.name"
            :value="item.id + '|||' + item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="currentLanguage['completeAutoClosePC']">
        <el-switch v-model="allData.autoClosePC"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAllDialog = false">{{ currentLanguage['cancelText'] }}</el-button>
      <el-button color="#626aef" @click="onClickAllTask">{{ currentLanguage['okText'] }}</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="showDialog">
    <el-input type="textarea" :value="textContent" :row="20" autosize readonly></el-input>
  </el-dialog>

  <el-drawer v-model="showDetail" size="95%" :title="currentLanguage['project_detail_btn_name']">
    <div class="tooltip">
      <el-button @click="onClickAll" color="#626aef">{{ currentLanguage['project_detail_btn_auto_all'] }}</el-button>
      <el-button @click="onClickPrompt" color="#626aef">
        {{ currentLanguage['project_detail_btn_auto_prompt'] }}
      </el-button>
      <el-button @click="onClickAudio" color="#626aef">
        {{ currentLanguage['project_detail_btn_auto_audio'] }}
      </el-button>
      <el-button @click="onClickImage" color="#626aef">
        {{ currentLanguage['project_detail_btn_auto_image'] }}
      </el-button>
      <el-button @click="onClickDraft" color="#626aef">
        {{ currentLanguage['project_detail_btn_auto_draft'] }}
      </el-button>
    </div>
    <el-table :data="project_texts" header-cell-class-name="custom-table-header">
      <el-table-column prop="id" label="ID" width="70"></el-table-column>
      <el-table-column prop="content" :label="currentLanguage['text_p_content']">
        <template #default="{ row }">
          <el-input type="textarea" :value="row.content" resize="none" :autosize="{ minRows: 4, maxRows: 4 }"
            readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="split" :label="currentLanguage['text_split_result']">
        <template #default="{ row }">
          <el-input type="textarea" :value="row.split.join(', ')" resize="none" :autosize="{ minRows: 4, maxRows: 4 }"
            readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="prompt" :label="currentLanguage['text_prompt_result']">
        <template #default="{ row }">
          <el-input type="textarea" :value="row.prompt" resize="none" :autosize="{ minRows: 4, maxRows: 4 }"
            readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="audio" :label="currentLanguage['text_audio_result']" width="350">
        <template #default="{ row }">
          <audio v-if="row.audio" controls>
            <source :src="row.audio" type="audio/mpeg">
            <el-link :href="row.audio" target="_blank">{{ currentLanguage['unsupport_audio'] }}</el-link>
          </audio>
          <span v-else>{{ currentLanguage['empty'] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="image" :label="currentLanguage['text_image_result']">
        <template #default="{ row }">
          <el-image v-if="row.image" :src="row.image" :preview-src-list="[row.image]" :preview-teleported="true"
            style="border-radius: 15px;"></el-image>
          <span v-else>{{ currentLanguage['empty'] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actions" :label="currentLanguage['operator']" width="150">
        <template #default="{ row }">
          <el-button type="primary" link @click="deleteDetail([row.id], 'audio')">
            {{ currentLanguage['clear_audio_btn'] }}
          </el-button>
          <br>
          <el-button type="primary" link @click="deleteDetail([row.id], 'image')">
            {{ currentLanguage['clear_image_btn'] }}
          </el-button>
          <br>
          <el-button type="primary" link @click="deleteTask(row)">{{ currentLanguage['delete'] }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<style>
.title {
  font-size: 20px;
  width: 100%;
  text-align: center;
}

.card-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3%;
}

.tooltip {
  margin-bottom: 15px;
}

.search {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  margin-top: 20px;
}
</style>