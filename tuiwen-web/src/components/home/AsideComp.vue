<script setup>
import { ref, inject, watch } from 'vue'

// ------------------语言------------------
const languages = inject('languages')
const language = inject('language')
const currentLanguage = ref(languages[language.value])
watch(() => language.value, () => {
  currentLanguage.value = languages[language.value]
})
// ------------------语言------------------

const { active } = defineProps({
  active: Number
})
const emits = defineEmits(['changeActive'])
function changeActive(name) {
  emits('changeActive', name)
}

const collapse = ref(false)
const collapse_text = ref(false)
function toggleCollapse() {
  collapse.value = !collapse.value
  if (!collapse.value) {
    setTimeout(() => {
      collapse_text.value = !collapse_text.value
    }, 300)
    return
  }
  collapse_text.value = !collapse_text.value
}
</script>

<template>
  <div class="menu" :style="collapse ? 'width: 40px;' : ''">
    <div class="menu-list">
      <div :class="`menu-item focus${collapse ? ' circle' : ''}`" @click="changeActive('add')">
        <el-icon>
          <Plus />
        </el-icon>
        <span v-show="!collapse_text">{{ currentLanguage['create_new_project'] }}</span>
      </div>
      <el-divider style="margin: 10px 0;" />
      <div :class="`menu-item${active === '' ? ' active' : ''}`" @click="changeActive('')">
        <el-icon>
          <Document />
        </el-icon>
        <span v-show="!collapse_text">{{ currentLanguage['home'] }}</span>
      </div>
      <div :class="`menu-item${active === 'setting' ? ' active' : ''}`" @click="changeActive('setting')">
        <el-icon>
          <Setting />
        </el-icon>
        <span v-show="!collapse_text">{{ currentLanguage['global_setting'] }}</span>
      </div>
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon>
          <ArrowLeft v-show="!collapse" />
          <ArrowRight v-show="collapse" />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
  width: 250px;

  transition: all .3s;
}

.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  position: absolute;
  right: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition: all .3s;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(0, 0, 0, .12);
  border-radius: 12px;
  box-sizing: border-box;
  color: #26244c;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 16px;
  height: 42px;

  transition: all .3s;
}

.menu-item:hover {
  background-color: rgba(0, 166, 255, 0.04);
  border: 1px solid rgba(22, 119, 171, 0.5);
}

.focus,
.focus:hover {
  height: 48px;
  border-radius: 40px;
  background: linear-gradient(75deg, #615ced -8%, #3e2fa7 181%);
  color: #fff;
}

.circle,
.circle:hover {
  border-radius: 50%;
  width: 48px;
  height: 48px;
  background: linear-gradient(75deg, #615ced -8%, #3e2fa7 181%);
  color: #fff;
}

.active,
.active:hover {
  background: linear-gradient(75deg, rgba(97, 92, 237, 0.04) -8%, rgba(63, 47, 167, 0.04)181%);
  border: 1px solid #1677ab;
}
</style>