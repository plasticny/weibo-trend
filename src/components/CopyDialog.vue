<template>
  <div id="copy_dg_comp">
    <BaseDialog ref="dialog" id="dialog">
      <div v-for="trend of trend_ls" :key="trend">
        #{{trend}}#
      </div>
      <font-awesome-icon icon="times" id="btn_close" class="click_icon"
        @click="() => { instance.refs.dialog.close() }"
      />
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue'
import { getCurrentInstance, ref, Ref } from 'vue'

const instance : VueRefs<{
  dialog: InstanceType<typeof BaseDialog>
}> = getCurrentInstance()! as any

const trend_ls : Ref<Array<string>> = ref([])

class ComponetApi {
  public show (ls : Array<string>) {
    trend_ls.value = ls
    instance.refs.dialog.open()
  }
}
const api = new ComponetApi()

defineExpose({
  show: api.show
})
</script>

<style lang="scss">
#copy_dg_comp {
  #dialog[open=''] {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 15px;
    padding-bottom: 5px;
    padding-right: 20px;
    padding-left: 20px;
  }

  #btn_close {
    margin-top: 15px;
    padding: 5px;
  }
}
</style>
